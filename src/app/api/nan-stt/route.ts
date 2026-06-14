// NaN speech-to-text — Vercel/Next.js serverless route.
// Records from ANY browser (incl. Firefox/Zen with no Web Speech API): the
// client sends captured audio here, we transcribe via OpenAI Whisper, and
// return the text. Key stays server-side, rate-limited like the chat route.
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KEY = process.env.OPENAI_API_KEY || '';
const STT_MODEL = process.env.NAN_STT_MODEL || 'whisper-1';

// ── rate limiting (separate counters from the chat route) ────
const PER_IP_MAX = 20, WINDOW_MS = 60_000, DAILY_MAX = 400, MAX_BYTES = 2_000_000;
const ipHits = new Map<string, { count: number; start: number }>();
let dailyCount = 0;
let dailyDay = new Date().getUTCDate();
function rateLimited(ip: string): string | null {
  const now = Date.now();
  const day = new Date().getUTCDate();
  if (day !== dailyDay) { dailyDay = day; dailyCount = 0; }
  if (dailyCount >= DAILY_MAX) return 'daily';
  let e = ipHits.get(ip);
  if (!e || now - e.start > WINDOW_MS) { e = { count: 0, start: now }; ipHits.set(ip, e); }
  if (e.count >= PER_IP_MAX) return 'ip';
  e.count++; dailyCount++;
  return null;
}

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET() {
  return Response.json({ ok: true, key: !!KEY, model: STT_MODEL }, { headers: CORS });
}

export async function POST(req: NextRequest) {
  if (!KEY) return Response.json({ error: 'no key configured' }, { status: 500, headers: CORS });

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const limited = rateLimited(ip);
  if (limited) return Response.json({ error: 'rate_limited', scope: limited }, { status: 429, headers: CORS });

  let audio: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get('audio');
    if (f instanceof File) audio = f;
  } catch { /* ignore */ }
  if (!audio) return Response.json({ error: 'no audio' }, { status: 400, headers: CORS });
  if (audio.size === 0 || audio.size > MAX_BYTES)
    return Response.json({ error: 'bad audio size' }, { status: 400, headers: CORS });

  try {
    const upstream = new FormData();
    // OpenAI infers format from the filename extension; keep it honest to the blob's type.
    const ext = (audio.type.includes('ogg') ? 'ogg' : audio.type.includes('mp4') ? 'mp4' : 'webm');
    upstream.append('file', audio, `clip.${ext}`);
    upstream.append('model', STT_MODEL);
    upstream.append('language', 'en');
    upstream.append('response_format', 'json');

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}` },
      body: upstream,
    });
    const j = await r.json();
    if (j.error) return Response.json({ error: 'upstream', detail: j.error.message }, { status: 502, headers: CORS });
    return Response.json({ text: (j.text || '').trim() }, { headers: CORS });
  } catch (e) {
    return Response.json({ error: 'upstream', detail: String((e as Error)?.message || e) }, { status: 502, headers: CORS });
  }
}
