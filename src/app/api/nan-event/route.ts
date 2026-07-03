// Visitor analytics beacon — the client posts tiny named events (section opens, tour, game,
// uplink...) here. Same Upstash store pattern as /api/nan-log, separate capped list nan:events.
// View: GET /api/nan-event?key=NAN_LOG_KEY&limit=500 → recent events + per-event counts.
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const LOG_KEY = process.env.NAN_LOG_KEY || '';
const LOG_KEEP = 5000;

// generous cap — events are tiny; this only stops spam floods
const PER_IP_MAX = 60, WINDOW_MS = 60_000;
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
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function store(entry: Record<string, unknown>) {
  try { console.log('[NAN_EVENT]', JSON.stringify(entry)); } catch { /* ignore */ }
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['LPUSH', 'nan:events', JSON.stringify(entry)],
      ['LTRIM', 'nan:events', '0', String(LOG_KEEP - 1)],
    ]),
  }).catch(() => { /* analytics must never break the page */ });
}

export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) return Response.json({ ok: false, error: 'rate' }, { status: 429, headers: CORS });
  let b: { ev?: string; data?: string } = {};
  try { b = await req.json(); } catch { /* sendBeacon posts text — try that too */ }
  const ev = (b.ev || '').toString().slice(0, 40);
  if (!/^[a-z0-9_.-]{2,40}$/.test(ev)) return Response.json({ ok: false }, { status: 400, headers: CORS });
  const data = b.data == null ? null : String(b.data).slice(0, 120);
  store({ ts: new Date().toISOString(), ip, ua: req.headers.get('user-agent')?.slice(0, 160) || null, ev, data });
  return Response.json({ ok: true }, { headers: CORS });
}

// private viewer: recent events + counts per event name
export async function GET(req: NextRequest) {
  if (!LOG_KEY) return Response.json({ error: 'viewer disabled — set NAN_LOG_KEY in env' }, { status: 404 });
  if ((req.nextUrl.searchParams.get('key') || '') !== LOG_KEY)
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!UPSTASH_URL || !UPSTASH_TOKEN)
    return Response.json({ error: 'no store configured' }, { status: 503 });

  const limit = Math.min(LOG_KEEP, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') || '500', 10) || 500));
  try {
    const r = await fetch(`${UPSTASH_URL}/lrange/nan:events/0/${limit - 1}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const j = await r.json();
    const events = Array.isArray(j.result)
      ? j.result.map((s: string) => { try { return JSON.parse(s); } catch { return { raw: s }; } })
      : [];
    const counts: Record<string, number> = {};
    for (const e of events) if (e && typeof e.ev === 'string') counts[e.ev] = (counts[e.ev] || 0) + 1;
    return Response.json({ count: events.length, counts, events }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ error: 'read failed', detail: String((e as Error)?.message || e) }, { status: 502 });
  }
}
