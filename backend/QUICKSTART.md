# Backend Quick Start Guide

## 60-Second Setup

### 1. Install & Configure
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your actual credentials
```

### 2. Database Setup
```bash
npm run db:setup
```

### 3. Start Development
```bash
npm run dev
# Server will start on http://localhost:3001
```

## Testing the API

### Health Check
```bash
curl http://localhost:3001/health
# Response: {"status":"ok","version":"2.0.0"}
```

### Get Prices (empty initially)
```bash
curl http://localhost:3001/api/prices/ray_ban_001
```

### Create Price Alert
```bash
curl -X POST http://localhost:3001/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "lensId": "ray_ban_001",
    "targetPrice": 5000,
    "consent": true
  }'
```

### Track Analytics Event
```bash
curl -X POST http://localhost:3001/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{
    "event": "quiz_complete",
    "lensId": "ray_ban_001",
    "sessionId": "sess_abc123"
  }'
```

## Environment Variables Checklist

Required for development:
- [ ] DATABASE_URL - PostgreSQL connection
- [ ] PORT - Server port (default 3001)
- [ ] NODE_ENV - Set to 'development'
- [ ] ALLOWED_ORIGIN - Frontend URL (default localhost:5173)

Required for price fetching (can skip initially):
- [ ] FLIPKART_AFFILIATE_ID
- [ ] FLIPKART_AFFILIATE_TOKEN

Required for email alerts (can skip initially):
- [ ] BREVO_SMTP_USER
- [ ] BREVO_SMTP_PASS
- [ ] FROM_EMAIL
- [ ] FROM_NAME

## Project Structure Reference

```
backend/
├── server.js              ← Express app entry
├── package.json           ← Dependencies
├── .env.example           ← Environment template
├── db/
│   ├── index.js          ← Database connection
│   └── schema.sql        ← Database tables
├── middleware/
│   ├── cors.js           ← CORS middleware
│   └── rateLimit.js      ← Rate limiting
├── routes/
│   ├── prices.js         ← /api/prices endpoints
│   ├── alerts.js         ← /api/alerts endpoints
│   └── analytics.js      ← /api/analytics endpoints
└── services/
    ├── flipkart.js       ← Flipkart API (TODO)
    ├── amazon.js         ← Amazon scraper (TODO)
    ├── mailer.js         ← Email sender
    └── scheduler.js      ← Cron jobs
```

## What Works Now (✓)

- Express server with middleware
- CORS and rate limiting
- Route structure for all endpoints
- Database connection and schema
- Email template (just add credentials)
- Analytics event tracking (basic)
- Price alert CRUD operations
- Unsubscribe page
- Scheduler setup (cron initialized)

## What Needs Implementation (TODO)

1. **Amazon Scraper** (`services/amazon.js`)
   - Extract price from Amazon search results
   - Currently has retry logic and anti-blocking measures in place

2. **Flipkart API** (`services/flipkart.js`)
   - Parse Flipkart affiliate API response
   - Currently has request setup in place

3. **Price Refresh Logic** (`routes/prices.js`)
   - Call Amazon and Flipkart services
   - Store results in database
   - Check and trigger alerts

## Database Verification

After setup, verify the database:

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# Check price_snapshots
SELECT * FROM price_snapshots;

# Check price_alerts
SELECT * FROM price_alerts;

# Check analytics_events
SELECT * FROM analytics_events;
```

## Common Issues

### "DATABASE_URL not set"
- Add to .env: `DATABASE_URL=postgresql://user:pass@localhost:5432/lensmatch`

### "Port 3001 in use"
- Change in .env: `PORT=3002`

### "CORS errors"
- Make sure ALLOWED_ORIGIN in .env matches frontend URL (default localhost:5173)

### "Email not working"
- Add Brevo SMTP credentials to .env
- Call `mailer.testConnection()` to verify

## Development Workflow

1. Make changes to files in routes/, services/, middleware/
2. nodemon will automatically restart server
3. Test with curl or Postman
4. Check logs in terminal
5. Database queries logged in development mode

## Deploying to Production

1. Set `NODE_ENV=production` in .env
2. Enable PostgreSQL SSL: `postgresql://...?sslmode=require`
3. Update ALLOWED_ORIGIN to your frontend domain
4. Use PM2 or systemd for process management
5. Set up error logging (Sentry, etc.)
6. Configure database backups
7. Test scheduler with prod data

## File Size Reference

| File | Lines | Purpose |
|------|-------|---------|
| server.js | ~60 | Express setup |
| routes/prices.js | ~80 | Price endpoints |
| routes/alerts.js | ~110 | Alert subscription |
| routes/analytics.js | ~80 | Event tracking |
| services/flipkart.js | ~70 | Flipkart API |
| services/amazon.js | ~130 | Amazon scraper |
| services/mailer.js | ~110 | Email sending |
| services/scheduler.js | ~150 | Cron scheduling |
| db/index.js | ~45 | Database pool |
| db/schema.sql | ~50 | Tables & indexes |

## Next Steps

1. Install dependencies: `npm install`
2. Set up .env file
3. Initialize database: `npm run db:setup`
4. Start dev server: `npm run dev`
5. Test health endpoint: `curl localhost:3001/health`
6. Review TODO items in services/ for implementation
7. Implement price fetching logic
8. Test with sample data

For full documentation, see [README.md](README.md)
