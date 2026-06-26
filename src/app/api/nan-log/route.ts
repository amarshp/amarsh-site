// Logs a realtime VOICE conversation turn (the WebRTC path bypasses /api/nan, so the client posts
// each turn's transcript here). Writes to the same store as text chats so /api/nan-logs shows everything.
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const LOG_KEEP = 2000;

// generous per-IP cap (voice turns are frequent) just to stop log spam
const PER_IP_MAX = 120, WINDOW_MS = 60_000;
const ipHits = new Map<string, { count: number; start: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  let e = ipHits.get(ip);
  if (!e || now - e.start > WINDOW_MS) { e = { count: 0, start: now }; ipHits.set(ip, e); }
  if (e.count >= PER_IP_MAX) return true;
  e.count++; return false;
}

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function logConvo(entry: Record<string, unknown>) {
  try { console.log('[NAN_CONVO]', JSON.stringify(entry)); } catch { /* ignore */ }
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['LPUSH', 'nan:convos', JSON.stringify(entry)],
      ['LTRIM', 'nan:convos', '0', String(LOG_KEEP - 1)],
    ]),
  }).catch(() => { /* logging must never break the call */ });
}

export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) return Response.json({ ok: false, error: 'rate' }, { status: 429, headers: CORS });
  let b: { msg?: string; reply?: string; mood?: string } = {};
  try { b = await req.json(); } catch { /* ignore */ }
  const msg = (b.msg || '').toString().slice(0, 600);
  const reply = (b.reply || '').toString().slice(0, 800);
  if (!msg && !reply) return Response.json({ ok: false }, { status: 400, headers: CORS });
  logConvo({ ts: new Date().toISOString(), ip, ua: req.headers.get('user-agent')?.slice(0, 160) || null, channel: 'voice', msg, reply, mood: b.mood || null });
  return Response.json({ ok: true }, { headers: CORS });
}
