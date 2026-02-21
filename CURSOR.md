# LensMatch India — Backend Spec for Cursor

## Overview
This repo's frontend (React + Vite) is already built. Your job is to build the `backend/` folder — a Node.js + Express REST API that powers price tracking, email alerts, and analytics.

The frontend runs on GitHub Pages. The backend will be deployed to **Railway.app** or **Render.com** (both have free tiers). It needs to allow CORS from the GitHub Pages domain.

---

## Your Folder: `backend/`

Everything you build goes inside `backend/`. Do NOT touch anything in `src/`, `public/`, `package.json`, `vite.config.js`, or any other frontend files.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Database | PostgreSQL (use `pg` npm package) |
| Scraping | Puppeteer (Amazon) |
| Price API | Flipkart Affiliate API (official, free) |
| Email | Nodemailer + Brevo free SMTP |
| Scheduler | node-cron |
| Rate limiting | express-rate-limit |
| Environment | dotenv |
| Deployment | Railway.app or Render.com |

---

## Files to Create

```
backend/
├── package.json
├── server.js              ← Express app entry, starts on PORT env var or 3001
├── .env.example           ← Template with all required env vars (no real values)
├── routes/
│   ├── prices.js          ← Price endpoints
│   ├── alerts.js          ← Email alert endpoints
│   └── analytics.js       ← Event tracking endpoint
├── services/
│   ├── flipkart.js        ← Flipkart Affiliate API integration
│   ├── amazon.js          ← Puppeteer Amazon India scraper
│   ├── mailer.js          ← Nodemailer + Brevo SMTP
│   └── scheduler.js       ← node-cron price refresh jobs
├── db/
│   ├── index.js           ← pg Pool setup
│   ├── schema.sql         ← Full PostgreSQL schema
│   └── migrations/
│       └── 001_initial.sql
└── middleware/
    ├── cors.js            ← CORS config for GitHub Pages
    └── rateLimit.js       ← IP-based rate limiting
```

---

## API Endpoints (MUST match exactly — frontend is already coded to call these)

### 1. GET /api/prices/:lensId
Returns current prices from Amazon and Flipkart, plus 30-day price history.

**Response:**
```json
{
  "amazon": {
    "price": 31500,
    "url": "https://www.amazon.in/...",
    "updatedAt": "2024-02-15T06:00:00Z"
  },
  "flipkart": {
    "price": 30999,
    "url": "https://www.flipkart.com/...",
    "updatedAt": "2024-02-15T06:00:00Z"
  },
  "history": [
    { "date": "2024-01-16", "price": 32000 },
    { "date": "2024-01-17", "price": 31800 }
  ]
}
```

If price data is not yet fetched, return `{ "amazon": null, "flipkart": null, "history": [] }` with 200 status (not 404).

### 2. POST /api/prices/refresh/:lensId
Triggers an immediate price refresh for this lens. Rate-limited to 1 request per 10 minutes per IP per lensId.

**Response (success):**
```json
{
  "success": true,
  "amazon": { "price": 31200, "url": "...", "updatedAt": "..." },
  "flipkart": { "price": 30800, "url": "...", "updatedAt": "..." }
}
```

**Response (rate limited):**
```json
{ "success": false, "rateLimited": true, "retryAfterMinutes": 8 }
```
HTTP 429 status for rate limited response.

### 3. POST /api/alerts
Subscribe to a price drop alert for a lens.

**Request body:**
```json
{
  "email": "user@example.com",
  "lensId": "nk-85-18g",
  "targetPrice": 28000,
  "consent": true
}
```

**Validation:**
- email must be valid
- consent must be true (if false, return 400 with message "Consent required")
- lensId must be a known lens ID (validate against the lens IDs in src/data/lenses.json)
- One subscription per email+lensId combo (upsert, don't create duplicates)

**Response:**
```json
{ "success": true, "message": "Alert set! We will email you if the price drops below ₹28,000." }
```

### 4. GET /api/alerts/unsubscribe?token=XYZ
Unsubscribes the user from a specific alert. The token is sent in the email.

**Response:** Plain HTML page confirming unsubscription (so the link works directly in browser).

### 5. POST /api/analytics/event
Track an anonymous analytics event. No PII collected, no cookies set.

**Request body:**
```json
{
  "event": "quiz_complete",
  "lensId": "nk-85-18g",
  "sessionId": "abc123"
}
```

**Valid event types:** quiz_start, quiz_complete, lens_view, catalogue_filter, rent_city_select, alert_signup, price_refresh

**Response:** `{ "ok": true }`

---

## Database Schema

```sql
-- Run: psql $DATABASE_URL < backend/db/schema.sql

CREATE TABLE IF NOT EXISTS price_snapshots (
  id           SERIAL PRIMARY KEY,
  lens_id      TEXT NOT NULL,
  platform     TEXT NOT NULL CHECK (platform IN ('amazon', 'flipkart')),
  price        INTEGER NOT NULL,  -- in INR, no decimals
  url          TEXT,
  source_type  TEXT NOT NULL CHECK (source_type IN ('scraped', 'api', 'manual')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_price_snapshots_lens_platform ON price_snapshots(lens_id, platform, created_at DESC);

CREATE TABLE IF NOT EXISTS price_alerts (
  id               SERIAL PRIMARY KEY,
  email            TEXT NOT NULL,
  lens_id          TEXT NOT NULL,
  target_price     INTEGER NOT NULL,
  consent          BOOLEAN NOT NULL DEFAULT true,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  triggered_at     TIMESTAMPTZ,
  UNIQUE(email, lens_id)
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id          SERIAL PRIMARY KEY,
  event       TEXT NOT NULL,
  lens_id     TEXT,
  session_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Price Scraping

### Amazon India (Puppeteer)
- Use Puppeteer with `headless: 'new'`
- Target URL: `https://www.amazon.in/s?k=[lens+search+term]`
- Extract the first organic result's price (`.a-price-whole`)
- Use random delays between requests (2-5 seconds)
- Use a realistic User-Agent string
- Implement retry with exponential backoff (max 3 retries)
- If blocked (CAPTCHA detected), log error and store no price for that run
- Never scrape more than 1 request per 3 seconds across all lenses

### Flipkart (Official Affiliate API — FREE)
- Register at https://affiliate.flipkart.com (free, instant approval)
- Use the Product Search API: `GET https://affiliate-api.flipkart.net/affiliate/1.0/search.json`
- Header: `Fk-Affiliate-Id: YOUR_ID` + `Fk-Affiliate-Token: YOUR_TOKEN`
- Search for each lens by name, extract the lowest price from results
- No scraping needed for Flipkart — use the official API

---

## Email Alerts (Nodemailer + Brevo)

When scheduled price job detects a price drop below a user's target:
1. Query `price_alerts` for all subscriptions where `lens_id` matches and `triggered_at IS NULL`
2. For each match where `new_price <= target_price`:
   - Send email via Nodemailer using Brevo free SMTP (smtp-relay.brevo.com, port 587)
   - Update `triggered_at` to NOW() so the alert is only sent once
   - Include unsubscribe link in email: `https://[your-backend-url]/api/alerts/unsubscribe?token=[unsubscribe_token]`

**Email template (HTML):**
```
Subject: Price Drop Alert — [Lens Name] is now ₹[price]

Hi photographer!

Good news — the [Lens Name] you're watching has dropped to ₹[price] on [platform].

[View Deal →] (button linking to Amazon/Flipkart)

This is a one-time alert. [Unsubscribe] from future alerts for this lens.

— LensMatch India team
```

---

## Scheduler (node-cron)

Run price refresh for ALL lenses twice daily:
- 6:00 AM IST (00:30 UTC)
- 6:00 PM IST (12:30 UTC)

```javascript
// In services/scheduler.js
cron.schedule('30 0,12 * * *', async () => {
  // For each lens in the LENSES array from src/data/lenses.json:
  //   1. Fetch Amazon price via Puppeteer
  //   2. Fetch Flipkart price via Affiliate API
  //   3. Store snapshots in price_snapshots table
  //   4. Check if any price alerts should be triggered
  //   5. Wait 3 seconds between lenses to avoid rate limiting
}, { timezone: 'Asia/Kolkata' })
```

---

## Environment Variables (backend/.env.example)

```
# Database
DATABASE_URL=postgresql://user:password@host:5432/lensmatch

# Flipkart Affiliate API (register free at affiliate.flipkart.com)
FLIPKART_AFFILIATE_ID=your_affiliate_id
FLIPKART_AFFILIATE_TOKEN=your_affiliate_token

# Email (Brevo free SMTP — register free at brevo.com)
BREVO_SMTP_USER=your_brevo_login_email
BREVO_SMTP_PASS=your_brevo_smtp_key
FROM_EMAIL=alerts@lensmatch-india.com
FROM_NAME=LensMatch India

# Server
PORT=3001
NODE_ENV=development

# CORS — GitHub Pages origin
ALLOWED_ORIGIN=https://siddhant-sarkar73.github.io
```

---

## CORS Configuration

Only allow requests from the frontend's GitHub Pages origin:

```javascript
// middleware/cors.js
const cors = require('cors')
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'

module.exports = cors({
  origin: [ALLOWED_ORIGIN, 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
})
```

---

## Deployment (Railway.app — Recommended)

1. Push `backend/` to the same GitHub repo (already there)
2. Go to railway.app → New Project → Deploy from GitHub → Select this repo
3. Set root directory to `backend/`
4. Add all env vars in Railway dashboard
5. Add PostgreSQL plugin in Railway (auto-sets DATABASE_URL)
6. Deploy — Railway gives you a `*.railway.app` URL
7. Copy that URL and set it as `VITE_API_URL` secret in your GitHub repo settings
8. Re-run the frontend GitHub Actions deployment (or it will auto-deploy on next main push)

---

## What NOT to Do

- Do NOT modify any files outside `backend/`
- Do NOT add affiliate tracking parameters to Amazon/Flipkart links (we are not in an affiliate program yet)
- Do NOT store any PII beyond email (no names, no IPs stored beyond rate-limit windows)
- Do NOT collect cookies or browser fingerprints
- Do NOT scrape more aggressively than specified (3 second minimum gap between requests)

---

## Questions?

The frontend API calls are in `src/hooks/usePrices.js`. If you need to check what the frontend expects, that file is your ground truth.

Good luck! The frontend is fully working with mock data — your backend just needs to plug into the four endpoints above.
