# Backend Scaffold Summary

All 14 core backend files have been created as scaffolds ready for Cursor to implement.

## Files Created

### Configuration & Entry Point
1. **package.json** - Dependencies configured with all required packages
   - Express, dotenv, cors, rate-limit, node-cron
   - Nodemailer for email, puppeteer for scraping, pg for database
   - Scripts for start, dev (nodemon), and db:setup

2. **server.js** - Complete Express server scaffold
   - Loads dotenv configuration
   - Mounts all middleware (CORS, rate limiting)
   - Mounts all routes (/api/prices, /api/alerts, /api/analytics)
   - Health check endpoint returns version 2.0.0
   - Starts scheduler automatically
   - Full error handling middleware
   - Listens on process.env.PORT || 3001

3. **.env.example** - Template for all required environment variables
   - Database, API credentials, SMTP, server config
   - Ready to copy as .env for development

4. **.gitignore** - Standard Node.js project ignore rules

### Database
5. **db/schema.sql** - Complete PostgreSQL schema
   - price_snapshots table with platform check, source_type enum
   - price_alerts table with UNIQUE constraint on (email, lens_id)
   - analytics_events table for user behavior tracking
   - Proper indexes on commonly queried fields
   - All tables use UUID primary keys and TIMESTAMPTZ for created_at

6. **db/index.js** - PostgreSQL connection pool
   - Uses pg.Pool with DATABASE_URL
   - Query helper function with logging in dev mode
   - Health check function
   - Error handling for idle client

### Middleware
7. **middleware/cors.js** - CORS configured for ALLOWED_ORIGIN + localhost fallback
   - Configurable origin from env var
   - Allows credentials
   - Supports all HTTP methods

8. **middleware/rateLimit.js** - Rate limiting middleware
   - generalLimit: 100 requests per 15 minutes
   - refreshLimit: 1 request per 10 minutes per IP per lensId
   - Health check endpoint exempt

### Routes
9. **routes/prices.js** - Price tracking endpoints
   - GET /api/prices/:lensId - Query latest + 30-day history
   - POST /api/prices/refresh/:lensId - Trigger fresh fetch (rate-limited)
   - Has TODO comments for Flipkart/Amazon integration
   - Full validation and error handling

10. **routes/alerts.js** - Price alert endpoints
    - POST /api/alerts - Create/update alert subscription
    - GET /api/alerts/unsubscribe?token=X - Unsubscribe confirmation
    - Email validation (regex)
    - Proper error responses
    - HTML unsubscribe page

11. **routes/analytics.js** - Analytics event tracking
    - POST /api/analytics/event - Track user events
    - Validates event types (7 valid types listed)
    - sessionId required, lensId optional
    - Proper error responses

### Services
12. **services/flipkart.js** - Flipkart API integration scaffold
    - fetchFlipkartPrice(lensName, lensId) function
    - HTTPS request setup with affiliate headers
    - Error handling and logging
    - TODO: API response parsing and price extraction

13. **services/amazon.js** - Amazon scraping scaffold
    - fetchAmazonPrice(lensName, lensId) function
    - Puppeteer launcher with anti-detection args
    - 3 realistic user agents for rotation
    - Random 2-5s delays for anti-blocking
    - Retry logic (3 attempts) with wait between retries
    - Proper browser cleanup
    - TODO: Product price extraction from search results

14. **services/mailer.js** - Email service via Brevo SMTP
    - sendPriceAlert() function with full HTML template
    - Professional email design with inline CSS
    - Personalized pricing display
    - Direct purchase link
    - Unsubscribe token integration
    - Connection verification helper

15. **services/scheduler.js** - Cron-based price refresh job
    - Runs at 6 AM and 6 PM IST (0:30 and 12:30 UTC)
    - Loads lenses from src/data/lenses.json
    - fetchPricesForLens() processes each lens
    - storePrice() saves to database
    - checkAndTriggerAlerts() sends emails when threshold hit
    - 3-second delay between lens processing
    - Graceful error handling - continues on failures
    - Manual trigger for development

## Implementation Status

All files are **fully scaffolded** with:
- Proper require/module.exports (CommonJS)
- Try/catch blocks and error logging
- Input validation on all routes
- Database queries ready to execute
- Service function signatures complete
- TODO comments marking implementation points

## What Cursor Needs to Implement

**Flipkart API (services/flipkart.js):**
- Parse JSON response from Flipkart API
- Extract price and product URL from response

**Amazon Scraping (services/amazon.js):**
- Use page.$ or page.evaluate to extract product price
- Parse price string to integer (INR)
- Return product URL

**Price Refresh (routes/prices.js):**
- Load lensName from lens data
- Call flipkart and amazon services
- Store results via storePrice helper
- Check alerts via checkAndTriggerAlerts

**Scheduler Updates (services/scheduler.js):**
- Verify lenses.json path or load from database
- Use actual lens name in email template

## Database Setup

To initialize the database:
```bash
npm run db:setup
# Or manually:
psql $DATABASE_URL -f db/schema.sql
```

## Starting Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure .env with your credentials

# Setup database
npm run db:setup

# Start development server
npm run dev
# Server runs on http://localhost:3001
```

## File Structure Overview

```
backend/
├── server.js                    # Express entry point
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore
├── README.md                    # Full documentation
├── SCAFFOLD_SUMMARY.md          # This file
├── db/
│   ├── index.js                # Database pool
│   └── schema.sql              # PostgreSQL schema
├── middleware/
│   ├── cors.js                 # CORS setup
│   └── rateLimit.js            # Rate limiting
├── routes/
│   ├── prices.js               # Price endpoints
│   ├── alerts.js               # Alert endpoints
│   └── analytics.js            # Analytics endpoints
└── services/
    ├── flipkart.js             # Flipkart API
    ├── amazon.js               # Amazon scraper
    ├── mailer.js               # Email service
    └── scheduler.js            # Cron scheduler
```

## Key Design Decisions

1. **CommonJS over ES6** - Better compatibility with node-cron and existing packages
2. **UUID for IDs** - Better than incremental integers for distributed systems
3. **TIMESTAMPTZ** - Handles timezone conversions automatically
4. **Unique constraint on (email, lens_id)** - Prevents duplicate alerts per user per lens
5. **Separate price snapshots** - Allows price history and trend analysis
6. **HTML unsubscribe** - Better UX than just JSON response
7. **Cron at fixed times** - More predictable than running constantly
8. **Sequential lens processing** - Prevents rate limiting and resource exhaustion

## Next Steps for Cursor

1. Review the TODO comments in services/ for implementation details
2. Implement Flipkart API response parsing
3. Implement Amazon price extraction with Puppeteer
4. Test each endpoint with provided curl examples in README
5. Verify email sending works with test account
6. Test scheduler with manual trigger during development
7. Add logging/monitoring for production deployment

All scaffolding is production-ready in structure; implementation is ready for your review.
