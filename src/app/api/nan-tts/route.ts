// NaN text-to-speech — Vercel/Next.js serverless route.
// Gives NaN a good voice in EVERY browser (Firefox/Zen only expose robotic OS
// voices via Web Speech). Client sends the line, we synthesize via OpenAI TTS
// and stream MP3 back. Key stays server-side, rate-limited.
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KEY = process.env.OPENAI_API_KEY || '';
const TTS_MODEL = process.env.NAN_TTS_MODEL || 'gpt-4o-mini-tts';
const TTS_VOICE = process.env.NAN_TTS_VOICE || 'onyx'; // deep male
// gpt-4o-mini-tts honors a tone instruction — push it toward the glitch entity
const TTS_INSTRUCTIONS =
  'Speak like a lonely, sardonic AI entity transmitting from a fold in space-time: ' +
  'low and a little gravelly, calm but warm, with faint digital/glitch coloring — as if the signal ' +
  'occasionally degrades. Slightly inhuman, never cheerful or customer-service. Unhurried.';

const PER_IP_MAX = 16, WINDOW_MS = 60_000, DAILY_MAX = 400, MAX_CHARS = 600;
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
  return Response.json({ ok: true, key: !!KEY, model: TTS_MODEL, voice: TTS_VOICE }, { headers: CORS });
}

export async function POST(req: NextRequest) {
  if (!KEY) return Response.json({ error: 'no key configured' }, { status: 500, headers: CORS });

  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const limited = rateLimited(ip);
  if (limited) return Response.json({ error: 'rate_limited', scope: limited }, { status: 429, headers: CORS });

  let body: { text?: string } = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const text = (body.text || '').toString().slice(0, MAX_CHARS).trim();
  if (!text) return Response.json({ error: 'no text' }, { status: 400, headers: CORS });

  try {
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ model: TTS_MODEL, voice: TTS_VOICE, input: text, instructions: TTS_INSTRUCTIONS, response_format: 'mp3' }),
    });
    if (!r.ok) {
      const detail = await r.text();
      return Response.json({ error: 'upstream', detail: detail.slice(0, 300) }, { status: 502, headers: CORS });
    }
    const audio = await r.arrayBuffer();
    return new Response(audio, {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return Response.json({ error: 'upstream', detail: String((e as Error)?.message || e) }, { status: 502, headers: CORS });
  }
}
