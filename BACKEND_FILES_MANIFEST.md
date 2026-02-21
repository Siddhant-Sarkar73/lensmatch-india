# Backend Files Manifest

Complete list of all 18 backend scaffold files created for LensMatch India Phase 2.

## Overview

- **Location:** `/sessions/eloquent-gracious-ride/mnt/outputs/phase2/backend/`
- **Total Files:** 18
- **Framework:** Node.js/Express with CommonJS
- **Database:** PostgreSQL
- **Status:** Fully scaffolded, ready for implementation

---

## Core Files (3)

### 1. `package.json`
**Purpose:** Project metadata and dependency management
**Key Dependencies:**
- express@^4.18.3 - Web framework
- pg@^8.11.3 - PostgreSQL client
- nodemailer@^6.9.12 - Email sending
- puppeteer@^22.4.0 - Web scraping
- node-cron@^3.0.3 - Scheduled tasks
- express-rate-limit@^7.2.0 - Rate limiting
- cors@^2.8.5 - CORS middleware
- dotenv@^16.4.5 - Environment loading
- uuid@^9.0.1 - UUID generation

**Scripts:**
- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run db:setup` - Initialize database

### 2. `server.js`
**Purpose:** Main Express application entry point
**Features:**
- Loads environment variables
- Mounts CORS and rate limiting middleware
- Registers all API routes
- Health check endpoint (GET /health)
- Initializes scheduler service
- Comprehensive error handling middleware
- Listens on PORT || 3001
**Lines:** ~60

### 3. `.env.example`
**Purpose:** Template for required environment variables
**Variables:**
- DATABASE_URL - PostgreSQL connection string
- FLIPKART_AFFILIATE_ID - Flipkart API credentials
- FLIPKART_AFFILIATE_TOKEN - Flipkart API credentials
- BREVO_SMTP_USER - Email service credentials
- BREVO_SMTP_PASS - Email service credentials
- FROM_EMAIL - Sender email address
- FROM_NAME - Sender display name
- PORT - Server port
- NODE_ENV - Environment mode
- ALLOWED_ORIGIN - CORS origin

---

## Database Files (2)

### 4. `db/schema.sql`
**Purpose:** PostgreSQL database schema
**Tables:**
1. **price_snapshots**
   - Stores price history from all sources
   - Columns: id (UUID), lens_id, platform (amazon|flipkart), price, url, source_type (scraped|api|manual), created_at
   - Index: (lens_id, platform, created_at DESC)

2. **price_alerts**
   - User price alert subscriptions
   - Columns: id (UUID), email, lens_id, target_price, consent, unsubscribe_token, created_at, triggered_at
   - Constraints: UNIQUE(email, lens_id), UNIQUE(unsubscribe_token)

3. **analytics_events**
   - User behavior tracking
   - Columns: id (UUID), event, lens_id (nullable), session_id, created_at
   - Index: (event, created_at DESC)

**Lines:** ~55

### 5. `db/index.js`
**Purpose:** PostgreSQL connection pool and query helpers
**Exports:**
- `pool` - pg.Pool instance
- `query(text, params)` - Helper with logging
- `getConnection()` - Health check function
**Features:**
- SSL support for production
- Query timing in development
- Error logging with context
- Graceful error handling
**Lines:** ~45

---

## Middleware Files (2)

### 6. `middleware/cors.js`
**Purpose:** CORS configuration
**Features:**
- Configurable origin from ALLOWED_ORIGIN env var
- Fallback to localhost:5173
- Supports all HTTP methods
- Credentials enabled
- Proper header handling
**Lines:** ~20

### 7. `middleware/rateLimit.js`
**Purpose:** Rate limiting middleware
**Limiters:**
- `generalLimit` - 100 requests per 15 minutes (skips /health)
- `refreshLimit` - 1 request per 10 minutes per IP per lensId
**Lines:** ~30

---

## Route Files (3)

### 8. `routes/prices.js`
**Purpose:** Price tracking endpoints
**Endpoints:**
- GET `/api/prices/:lensId` - Fetch latest and 30-day history
- POST `/api/prices/refresh/:lensId` - Trigger fresh price fetch (rate-limited)
**Features:**
- Queries price_snapshots by platform
- Returns latest and historical prices
- Full validation and error handling
**TODO:** Flipkart/Amazon service integration
**Lines:** ~85

### 9. `routes/alerts.js`
**Purpose:** Price alert subscription management
**Endpoints:**
- POST `/api/alerts` - Create/update alert
- GET `/api/alerts/unsubscribe?token=X` - Unsubscribe confirmation
**Features:**
- Email validation (regex)
- Upsert on (email, lens_id)
- HTML unsubscribe confirmation page
- Proper error responses
**Lines:** ~110

### 10. `routes/analytics.js`
**Purpose:** User event tracking
**Endpoints:**
- POST `/api/analytics/event` - Log user event
**Valid Events:**
- quiz_start, quiz_complete, lens_view
- catalogue_filter, rent_city_select
- alert_signup, price_refresh
**Features:**
- Event type validation
- lensId optional, sessionId required
- Proper error responses
**Lines:** ~80

---

## Service Files (4)

### 11. `services/flipkart.js`
**Purpose:** Flipkart Affiliate API integration
**Exports:**
- `async fetchFlipkartPrice(lensName, lensId)` - Returns {price, url} or null
**Features:**
- HTTPS request to Flipkart API
- Affiliate authentication headers
- Error handling and logging
- Graceful fallback on failure
**TODO:** Response parsing and price extraction
**Lines:** ~70

### 12. `services/amazon.js`
**Purpose:** Amazon India price scraping via Puppeteer
**Exports:**
- `async fetchAmazonPrice(lensName, lensId)` - Returns {price, url} or null
**Features:**
- Puppeteer browser automation
- 3 realistic user agents for rotation
- Random 2-5s delays for anti-blocking
- Retry logic (3 attempts) with waits
- Anti-detection arguments
- Proper browser cleanup
**TODO:** Product price extraction from page
**Lines:** ~130

### 13. `services/mailer.js`
**Purpose:** Email service via Brevo SMTP
**Exports:**
- `async sendPriceAlert(data)` - Send price alert email
- `async testConnection()` - Verify email setup
**Features:**
- Professional HTML email template
- Inline CSS styling
- Personalized lens name and price
- Direct purchase link to product
- Unsubscribe token integration
- Proper error handling
**Email Fields:**
- Recipient email
- Lens name
- Current price (formatted INR)
- Platform (amazon/flipkart)
- Purchase URL
- Unsubscribe link
**Lines:** ~110

### 14. `services/scheduler.js`
**Purpose:** Cron-based price refresh and alert checking
**Exports:**
- `start()` - Initialize scheduler
- `runOnce()` - Manual trigger for testing
- `runScheduler()` - Main job logic
- `fetchPricesForLens(lens)` - Fetch for single lens
- `checkAndTriggerAlerts(lensId)` - Check alerts and send emails
**Schedule:**
- 6 AM IST (0:30 UTC)
- 6 PM IST (12:30 UTC)
**Process:**
1. Load lenses from src/data/lenses.json
2. Fetch Flipkart and Amazon prices
3. Store snapshots in database
4. Check price alerts
5. Send emails when threshold met
6. 3-second delay between lenses
**Error Handling:** Continues on individual failures
**Lines:** ~150

---

## Documentation Files (5)

### 15. `README.md`
**Purpose:** Complete backend documentation
**Sections:**
- Project structure diagram
- Setup instructions
- Environment variables table
- Running development/production
- API endpoints reference
- Database schema details
- Service descriptions
- Development notes
- Testing examples
- Production deployment guide
**Lines:** ~350

### 16. `SCAFFOLD_SUMMARY.md`
**Purpose:** Overview of scaffold structure and implementation status
**Contents:**
- Files created summary
- Implementation status
- What Cursor needs to implement
- Database setup instructions
- File structure overview
- Key design decisions
- Next steps
**Lines:** ~200

### 17. `QUICKSTART.md`
**Purpose:** 60-second setup and basic testing guide
**Contents:**
- Quick installation steps
- API testing examples (curl)
- Environment variables checklist
- Project structure reference
- What works vs TODO
- Common issues and fixes
- Development workflow
- Production deployment notes
**Lines:** ~250

### 18. `.gitignore`
**Purpose:** Standard Node.js project ignore rules
**Ignores:**
- node_modules/, package-lock.json
- .env and environment files
- Log files
- OS files (.DS_Store, Thumbs.db)
- IDE files (.vscode, .idea)
- Build and dist folders
- Coverage and test files
- Temporary files

### 19. `BACKEND_FILES_MANIFEST.md`
**Purpose:** This document - comprehensive file reference
**Contains:** Complete manifest of all files with descriptions

---

## File Statistics

| Category | Count | Purpose |
|----------|-------|---------|
| Core | 3 | Entry point, config, dependencies |
| Database | 2 | Schema and connection |
| Middleware | 2 | CORS and rate limiting |
| Routes | 3 | API endpoints |
| Services | 4 | Business logic |
| Documentation | 5 | Guides and references |
| **Total** | **19** | **Complete scaffold** |

---

## Quick File Lookup

**Need to modify CORS?** → `middleware/cors.js`
**Need to adjust rate limits?** → `middleware/rateLimit.js`
**Adding new route?** → `routes/*.js`
**Implement scraping?** → `services/amazon.js`
**Implement API?** → `services/flipkart.js`
**Email sending?** → `services/mailer.js`
**Database queries?** → `db/index.js`
**Server config?** → `server.js`
**Dependencies?** → `package.json`
**Environment setup?** → `.env.example`

---

## Implementation Checklist for Cursor

- [ ] Parse Flipkart API response in `services/flipkart.js`
- [ ] Extract Amazon price with Puppeteer in `services/amazon.js`
- [ ] Implement price refresh in `routes/prices.js`
- [ ] Verify scheduler loads lenses correctly from data file
- [ ] Test all endpoints with provided curl examples
- [ ] Verify email sending with test credentials
- [ ] Test scheduler trigger with manual job
- [ ] Load test rate limiting
- [ ] Verify unsubscribe token flow end-to-end

---

## Deployment Checklist

- [ ] All TODO items implemented
- [ ] Environment variables configured
- [ ] Database initialized and tested
- [ ] Dependencies installed (`npm install`)
- [ ] All tests passing
- [ ] Error logging configured
- [ ] Database backups scheduled
- [ ] SSL enabled for production
- [ ] Process manager configured (PM2/systemd)
- [ ] Monitoring setup (optional but recommended)

---

## Summary

All 19 files are created and ready for development. The scaffold provides:
- ✅ Complete Express server setup
- ✅ PostgreSQL schema and connection
- ✅ All route endpoints with validation
- ✅ Middleware configuration
- ✅ Service structure for integrations
- ✅ Email template and scheduler
- ✅ Comprehensive documentation

**Next Step:** Review TODO comments in services/ and implement the integrations.

For quick start, see [QUICKSTART.md](QUICKSTART.md)
For full details, see [README.md](README.md)
