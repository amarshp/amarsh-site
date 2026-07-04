// NaN "leave a note" sink — a visitor tells NaN (in voice mode) a message for Amarsh; the client POSTs it here
// and we email it to him. The email send is gated on RESEND_API_KEY; without it we still return ok (so NaN can
// confirm delivery in-character) but log a warning server-side. Notes are short and rate-limited to curb abuse.
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RESEND_KEY = process.env.RESEND_API_KEY || '';
const NOTE_TO = process.env.NAN_NOTE_TO || 'pedapatiamarsh@gmail.com';
const NOTE_FROM = process.env.NAN_NOTE_FROM || 'NaN <onboarding@resend.dev>'; // resend.dev works out-of-box to the account owner; swap for a verified amarsh.in sender to reach any inbox

// ── per-IP + global rate limit (in-memory per warm instance) ──
const PER_IP_MAX = 4, WINDOW_MS = 10 * 60_000, DAILY_MAX = 200;
const ipHits = new Map<string, { count: number; start: number }>();
let dailyCount = 0;
let dailyDay = new Date().getUTCDate();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const day = new Date().getUTCDate();
  if (day !== dailyDay) { dailyDay = day; dailyCount = 0; }
  if (dailyCount >= DAILY_MAX) return true;
  let e = ipHits.get(ip);
  if (!e || now - e.start > WINDOW_MS) { e = { count: 0, start: now }; ipHits.set(ip, e); }
  if (e.count >= PER_IP_MAX) return true;
  e.count++; dailyCount++;
  return false;
}

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
export async function GET() { return Response.json({ ok: true, email: !!RESEND_KEY }, { headers: CORS }); }

async function sendEmail(name: string, note: string, ip: string): Promise<boolean> {
  if (!RESEND_KEY) { console.warn('[nan-note] RESEND_API_KEY not set — note received but not emailed:', { name, note }); return false; }
  try {
    const who = name ? `${name}` : 'an anonymous visitor';
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: NOTE_FROM,
        to: [NOTE_TO],
        subject: `NaN note from ${who}`,
        text: `${who} left a note for you via NaN (voice mode on amarsh.in):\n\n"${note}"\n\n— visitor name: ${name || '(not given)'}\n— ip: ${ip}`,
      }),
    });
    if (!r.ok) { console.warn('[nan-note] resend send failed:', r.status, await r.text().catch(() => '')); return false; }
    return true;
  } catch (e) {
    console.warn('[nan-note] resend error:', String((e as Error)?.message || e));
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (rateLimited(ip)) return Response.json({ ok: false, error: 'rate_limited' }, { status: 429, headers: CORS });

  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: 'bad_json' }, { status: 400, headers: CORS }); }
  const b = (body || {}) as { name?: unknown; note?: unknown };
  const note = typeof b.note === 'string' ? b.note.trim().slice(0, 2000) : '';
  const name = typeof b.name === 'string' ? b.name.trim().slice(0, 60) : '';
  if (!note) return Response.json({ ok: false, error: 'empty_note' }, { status: 400, headers: CORS });

  const emailed = await sendEmail(name, note, ip);
  // ok:true even if email is unconfigured/failed → NaN stays in character; server logs capture the miss
  return Response.json({ ok: true, emailed }, { headers: CORS });
}
