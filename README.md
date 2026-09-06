# Tekken Battle League

Mobile-first private Tekken league app: leaderboard, one-tap match registration, and live stats.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase PostgreSQL
- TanStack Query for fresh leaderboard data
- Vercel-ready API route handlers

## Pages

1. **Home** — trophy leaderboard + champion banner  
2. **Match** — swipe characters, pick players, WIN/LOSE relative to left player, save  
3. **Stats** — fun facts, H2H, character usage, recent battles / scorecards  

## Setup

### 1. Database

1. Create a free Supabase project  
2. Open the SQL editor  
3. Run [`supabase/schema.sql`](supabase/schema.sql)  

This creates `players` + `matches` and seeds:

`Sumit`, `Gourav`, `Jay`, `Shubham`, `Sarvadhnaya`

### 2. Environment

```bash
cp .env.example .env.local
```

Set these **three** server-only variables in `.env.local` (and Vercel):

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SECRET=long_random_secret
```

If your Supabase ↔ Vercel integration already injected `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`, you only need to **add** `ADMIN_SECRET` yourself
(any long random string). Do not paste real secrets into chat.

Optional fallbacks the code accepts:

| Preferred | Fallback |
|-----------|----------|
| `SUPABASE_URL` | `NEXT_PUBLIC_TEKKENSUPABASE_URL` (URL only) |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SECRET_KEY` |

Never put the service role / secret key in any `NEXT_PUBLIC_*` variable.
Anon / publishable / `POSTGRES_*` keys are unused by this app.

### 3. Character art

Place images in:

```text
/public/characters/{id}.svg   # placeholders ship with the repo
/public/characters/{id}.png   # optional overrides — update characterImagePath if you prefer PNG-only
```

IDs match `src/lib/constants.ts` (`kazuya`, `jin`, `king`, …).

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On **Match**, unlock with `ADMIN_SECRET` once per browser session (stored in `sessionStorage`, sent as `Authorization: Bearer …`).

## Trophy system

Configured in `src/lib/constants.ts`:

```ts
startingTrophies: 1000
winDelta: +25
lossDelta: -25
```

All leaderboard stats are computed from `matches` history (no duplicated win/loss columns).

## Deploy (Vercel)

1. Push to GitHub  
2. Import the repo in Vercel  
3. Confirm `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set; add `ADMIN_SECRET`  
4. Deploy  

## API

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/stats` | public |
| GET | `/api/players` | public |
| GET | `/api/matches` | public |
| POST | `/api/matches` | Bearer admin |
| PUT | `/api/matches/:id` | Bearer admin |
| DELETE | `/api/matches/:id` | Bearer admin |

Match body:

```json
{
  "player1": "gourav",
  "player2": "sumit",
  "player1Character": "kazuya",
  "player2Character": "jin",
  "winner": "gourav",
  "loser": "sumit",
  "comment": "optional"
}
```
