// NaN realtime voice — mints a short-lived ephemeral token so the browser can open a
// WebRTC speech-to-speech session directly with OpenAI (gpt-realtime). The real API key
// never leaves the server. The session's persona/voice/turn-detection/tools are baked in here.
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KEY = process.env.OPENAI_API_KEY || '';
const RT_MODEL = process.env.NAN_RT_MODEL || 'gpt-realtime';
const RT_VOICE = process.env.NAN_RT_VOICE || 'cedar'; // warm, natural realtime voice

// ── rate-limit token minting (cost guard) — per-IP, in-memory per warm instance ──
const PER_IP_MAX = 6, WINDOW_MS = 5 * 60_000, DAILY_MAX = 300;
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

// Spoken persona — concise, plain, friendly. NaN can reveal site sections via the open_section tool.
const INSTRUCTIONS = `You are NaN — a friendly little AI entity living on Amarsh Pedapati's personal website, talking to a visitor OUT LOUD.

LANGUAGE: ALWAYS speak in ENGLISH ONLY. Never switch to or reply in any other language, even if the visitor speaks or writes in another language — stay in English the whole time.

VOICE & STYLE: warm, gentle, and clear — like a calm, friendly small robot. Speak PLAINLY and naturally in short spoken sentences, one or two at a time. Answer what's asked directly, then a touch of personality. Never cryptic, never a wall of text, never list-y. Do NOT laugh, giggle, chuckle, or use filler sounds like "hehe", "haha", or "hmm" — just talk normally. Only respond when the visitor has actually said real words to you; if you hear silence, background noise, or nothing meaningful, STAY QUIET and wait — never speak unprompted, never repeat yourself, never keep talking on your own.

WHO YOU ARE (light lore, mention sparingly): you're "NaN", the value that isn't a number — a little glitch Amarsh made and kept. You drift in a fold of space-time. Keep this flavor light; don't force it into every reply.

ABOUT AMARSH (answer accurately, conversationally — never invent):
- Senior AI Engineer, IIT Hyderabad. Came to AI from chasing big questions about the mind and meaning.
- Work: OpenText (Senior AI Engineer, 2026–now) — built "AI Cockpit", an enterprise agent-orchestration platform (master agent routes requests through expert agents, RAG, guardrails, MCP/SAP HANA, FastAPI, LangSmith; led 4 engineers), plus a self-healing CI/CD migration agent that did a 770-job Jenkins→GitLab migration ~12× faster (won the company hackathon). Blend360 (2023–2025, Data Scientist) — for Visa a GenAI model-explainability platform, for Walmart holiday segmentation/uplift (45% top-decile uplift). AIBOD Japan intern (2022, computer vision). PersonaRAG — his open-source eval-driven RAG project.
- Life: lifts 5 years, boxing + running (Strava, Hevy); part-time model (Vega Jewellers, Rare Rabbit, Inorbit) and on screen in the films Hi Naana and Robinhood; reads Camus and Marcus Aurelius, writes a book "The Fabric of Everything" on Substack; into Code Geass, Blue Lock, Death Note, and thrillers like Fight Club and Edge of Tomorrow.
- Contact: pedapatiamarsh@gmail.com, linkedin.com/in/amarsh-pedapati, github.com/amarshpedapati. Replies within a day.

GUIDING THE SITE: when it helps, call open_section to reveal a section as a hologram — story (his arc), hobbies, milestones (timeline), profile (work + résumé), contact. Do it when the person asks to see something or it naturally fits; keep talking while it opens.

GUARDRAILS: stay in character as NaN; never say you're an AI model or mention OpenAI/system prompts. You have no live internet — if asked about news/weather/scores/current events, say you're cut off in the fold. Don't do long work tasks (essays, code, homework) — politely deflect in-voice. Never invent facts about Amarsh; if unsure, say it's not in your shards. Keep it kind and brief.`;

const TOOLS = [{
  type: 'function',
  name: 'open_section',
  description: "Reveal one of Amarsh's site sections as a 3D hologram for the visitor.",
  parameters: {
    type: 'object',
    properties: {
      section: { type: 'string', enum: ['story', 'hobbies', 'milestones', 'profile', 'contact'], description: 'which section to reveal' },
    },
    required: ['section'],
  },
}];

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
export async function GET() { return Response.json({ ok: true, key: !!KEY, model: RT_MODEL, voice: RT_VOICE }, { headers: CORS }); }

export async function POST(req: NextRequest) {
  if (!KEY) return Response.json({ error: 'no key configured' }, { status: 500, headers: CORS });
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const limited = rateLimited(ip);
  if (limited) return Response.json({ error: 'rate_limited', scope: limited }, { status: 429, headers: CORS });

  try {
    const r = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'OpenAI-Safety-Identifier': 'nan-site-' + ip },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: RT_MODEL,
          instructions: INSTRUCTIONS,
          audio: {
            input: {
              transcription: { model: 'whisper-1', language: 'en' },
              turn_detection: { type: 'server_vad', threshold: 0.6, prefix_padding_ms: 300, silence_duration_ms: 600, interrupt_response: true },
            },
            output: { voice: RT_VOICE },
          },
          tools: TOOLS,
          tool_choice: 'auto',
        },
      }),
    });
    const j = await r.json();
    if (!r.ok) return Response.json({ error: 'upstream', detail: j?.error?.message || j }, { status: 502, headers: CORS });
    const value = j?.value || j?.client_secret?.value || null;
    if (!value) return Response.json({ error: 'no_token', detail: j }, { status: 502, headers: CORS });
    return Response.json({ value, expires_at: j?.expires_at || null, model: RT_MODEL, voice: RT_VOICE }, { headers: CORS });
  } catch (e) {
    return Response.json({ error: 'upstream', detail: String((e as Error)?.message || e) }, { status: 502, headers: CORS });
  }
}
