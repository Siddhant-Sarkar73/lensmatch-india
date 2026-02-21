# LensMatch India - Phase 2 Backend

Price tracking, email alerts, and analytics backend for LensMatch India.

## Deploy to Railway

See **[DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)** for step-by-step instructions. In short: Railway → New Project → Deploy from GitHub → select this repo → set **Root Directory** to `backend` → Add PostgreSQL → set variables → Generate domain.

## Project Structure

```
backend/
├── server.js                 # Express app entry point
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── README.md                 # This file
├── db/
│   ├── index.js             # PostgreSQL connection pool
│   └── schema.sql           # Database schema
├── middleware/
│   ├── cors.js              # CORS configuration
│   └── rateLimit.js         # Rate limiting middleware
├── routes/
│   ├── prices.js            # Price endpoints
│   ├── alerts.js            # Alert subscription endpoints
│   └── analytics.js         # Event tracking endpoints
└── services/
    ├── flipkart.js          # Flipkart API integration
    ├── amazon.js            # Amazon web scraping
    ├── mailer.js            # Email service (Brevo SMTP)
    └── scheduler.js         # Cron-based price refresh job
```

## Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 13+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
npm run db:setup
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/lensmatch` |
| `FLIPKART_AFFILIATE_ID` | Flipkart affiliate ID | `affiliate123` |
| `FLIPKART_AFFILIATE_TOKEN` | Flipkart affiliate API token | `token_xyz` |
| `BREVO_SMTP_USER` | Brevo email for SMTP | `noreply@example.com` |
| `BREVO_SMTP_PASS` | Brevo SMTP password | `password123` |
| `FROM_EMAIL` | Email sender address | `noreply@lensmatch.in` |
| `FROM_NAME` | Email sender name | `LensMatch India` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` or `production` |
| `ALLOWED_ORIGIN` | CORS allowed origin | `http://localhost:5173` |

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Prices
- **GET** `/api/prices/:lensId` - Get current and historical prices
- **POST** `/api/prices/refresh/:lensId` - Trigger fresh price fetch (rate-limited)

### Alerts
- **POST** `/api/alerts` - Create/update price alert subscription
- **GET** `/api/alerts/unsubscribe?token=X` - Unsubscribe from alert

### Analytics
- **POST** `/api/analytics/event` - Track user analytics event

## Database Schema

### `price_snapshots`
Stores price data from various sources
- `id` (UUID, PK)
- `lens_id` (TEXT) - Reference to lens
- `platform` (TEXT) - 'amazon' or 'flipkart'
- `price` (INTEGER) - Price in INR
- `url` (TEXT) - Product URL
- `source_type` (TEXT) - 'scraped', 'api', or 'manual'
- `created_at` (TIMESTAMPTZ)

### `price_alerts`
User price alert subscriptions
- `id` (UUID, PK)
- `email` (TEXT) - User email
- `lens_id` (TEXT) - Target lens
- `target_price` (INTEGER) - Alert triggers when price <= this
- `consent` (BOOLEAN) - Opted in
- `unsubscribe_token` (TEXT, UNIQUE) - For unsubscribe links
- `created_at` (TIMESTAMPTZ)
- `triggered_at` (TIMESTAMPTZ) - When alert was sent
- UNIQUE(email, lens_id)

### `analytics_events`
User behavior tracking
- `id` (UUID, PK)
- `event` (TEXT) - Event type
- `lens_id` (TEXT, nullable) - Reference lens (if applicable)
- `session_id` (TEXT) - User session ID
- `created_at` (TIMESTAMPTZ)

Valid event types:
- `quiz_start` - User starts lens selection quiz
- `quiz_complete` - User completes lens selection quiz
- `lens_view` - User views lens details
- `catalogue_filter` - User filters catalogue
- `rent_city_select` - User selects rental city
- `alert_signup` - User signs up for price alert
- `price_refresh` - User manually refreshes prices

## Services

### Flipkart Service (`services/flipkart.js`)
- Integrates with Flipkart Affiliate API
- Returns current price and product URL
- Handles API errors gracefully

**TODO for implementation:**
- Parse Flipkart API response
- Extract price and product URL

### Amazon Service (`services/amazon.js`)
- Uses Puppeteer for web scraping
- Searches amazon.in for lens products
- Includes anti-blocking measures (user agent rotation, delays)
- Retry logic (3 attempts)

**TODO for implementation:**
- Extract product price from Amazon search results
- Handle pagination if needed

### Mailer Service (`services/mailer.js`)
- Sends price alert emails via Brevo SMTP
- Includes HTML email template
- Manages unsubscribe links

**Features:**
- Professional HTML email design
- Personalized lens name and price
- Direct purchase link
- Unsubscribe option

### Scheduler (`services/scheduler.js`)
- Runs at 6 AM and 6 PM IST
- Fetches prices for all lenses
- Stores price snapshots
- Checks and triggers alerts
- 3-second delay between lens processing

## Development Notes

### Rate Limiting
- General: 100 requests per 15 minutes
- Price refresh: 1 request per 10 minutes per IP per lens

### Error Handling
- All routes have try/catch blocks
- Database errors logged with query details
- Service errors return graceful fallbacks
- Scheduler continues on individual lens failures

### Logging
- Development mode logs all database queries
- All errors logged with context
- Scheduler logs job start/end and progress

## TODO Items for Cursor

These are marked with `// TODO:` comments in the code:

1. **prices.js** - Implement refresh endpoint logic to fetch from Flipkart and Amazon
2. **flipkart.js** - Parse Flipkart API response and extract price/URL
3. **amazon.js** - Extract product price from Amazon search results
4. **scheduler.js** - Load lens names and update alert email template

## Testing

### Manual API Testing
```bash
# Health check
curl http://localhost:3001/health

# Get prices
curl http://localhost:3001/api/prices/lens_001

# Create alert
curl -X POST http://localhost:3001/api/alerts \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","lensId":"lens_001","targetPrice":5000,"consent":true}'

# Track event
curl -X POST http://localhost:3001/api/analytics/event \
  -H "Content-Type: application/json" \
  -d '{"event":"quiz_start","sessionId":"session_123"}'
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use PostgreSQL with SSL enabled
3. Configure proper CORS origin
4. Set up environment variables securely
5. Use process manager (PM2, systemd, etc.)
6. Enable monitoring and error logging
7. Configure database backups

## License

Proprietary - LensMatch India
