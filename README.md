# GuardLayer Pulse

A production-minded cybersecurity health-check MVP for South African small businesses. Pulse performs safe, read-only DNS and website checks, calculates a clear 0–100 score, and gives owners a plain-English fix checklist. It does **not** scrape the dark web or check breached email addresses.

## Monorepo

- `apps/frontend` — React, Vite, and Tailwind customer experience
- `apps/backend` — FastAPI API, modular DNS/web scanners, scoring, and tests
- `supabase/schema.sql` — Postgres scan-results schema
- `shared/risk-scoring.md` — scoring contract shared across product surfaces

## Local setup

### Frontend

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173 and proxies `/api` to port 8000.

### Backend

```bash
cd apps/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Copy `apps/backend/.env.example` to `.env` and add Supabase credentials to persist scans. Without them, scans still work but are not stored.

### Database

Run `supabase/schema.sql` in the Supabase SQL editor. Keep the service-role key server-side only.

### Tests

```bash
cd apps/backend
pytest
```

## API

`POST /api/scan/domain`

```json
{ "domain": "example.co.za" }
```

Checks SPF, a DKIM placeholder, DMARC, MX, HTTPS availability, SSL expiry, security headers, common admin paths, and HTTP status. The checks are intentionally non-invasive and should be extended with rate limiting and a job queue before high-volume use.
