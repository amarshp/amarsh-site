# NaN proxy (legacy dev fallback)

Keeps the OpenAI key **server-side** so the browser never sees it, with rate limiting so the account can't be drained.

> **Production does NOT use this.** The deployed site talks to the Next.js routes
> (`src/app/api/nan*`), which build NaN's facts from `src/lib/nan-knowledge.ts` —
> that file is the single source of truth. This proxy only matters when the static
> page is opened without `npm run dev`; its inline prompt will drift unless synced
> by hand from the knowledge lib.

## Run
```bash
cd nan-server
node server.js
```
Then open the page (canonical: `public/poc-9-creature.html`, or just `npm run dev`). NaN auto-detects the proxy on the port from `.env`; if it's down or rate-limited, NaN falls back to its built-in offline brain.

## Config (`.env`)
- `OPENAI_API_KEY` — your key. **Rotate the one shared earlier; it's compromised.** Edit this file to swap it.
- `NAN_MODEL` — default `gpt-4o-mini` (cheap).
- `NAN_PORT` — default `8787`.

## Protections
- Key only in `.env` (gitignored), never in client code.
- Per-IP: 8 requests / minute. Global: 250 / day hard cap. `max_tokens` capped at 220 per reply.
- Edit the constants at the top of `server.js` to tune.

## Deploy later
Drop `server.js` logic into a Vercel/Cloudflare Worker function, set `OPENAI_API_KEY` as a project env var, and point the frontend `NAN_API` at the deployed URL.
