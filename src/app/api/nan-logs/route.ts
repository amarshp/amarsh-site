// NaN conversation-log viewer — PRIVATE. Reads the capped list /api/nan writes to Upstash.
// Protect with the NAN_LOG_KEY env var. View: /api/nan-logs?key=YOUR_SECRET&limit=200
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const LOG_KEY = process.env.NAN_LOG_KEY || '';

export async function GET(req: NextRequest) {
  if (!LOG_KEY) return Response.json({ error: 'viewer disabled — set NAN_LOG_KEY in env' }, { status: 404 });
  if ((req.nextUrl.searchParams.get('key') || '') !== LOG_KEY)
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!UPSTASH_URL || !UPSTASH_TOKEN)
    return Response.json({ error: 'no store configured — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN' }, { status: 503 });

  const limit = Math.min(2000, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') || '200', 10) || 200));
  try {
    const r = await fetch(`${UPSTASH_URL}/lrange/nan:convos/0/${limit - 1}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const j = await r.json();
    const convos = Array.isArray(j.result)
      ? j.result.map((s: string) => { try { return JSON.parse(s); } catch { return { raw: s }; } })
      : [];
    return Response.json({ count: convos.length, convos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ error: 'read failed', detail: String((e as Error)?.message || e) }, { status: 502 });
  }
}
