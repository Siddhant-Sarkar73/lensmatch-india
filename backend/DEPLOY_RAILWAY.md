# Deploy Backend to Railway

Follow these steps to get your LensMatch India backend live on Railway.

## 1. Create a Railway account and project

1. Go to **[railway.app](https://railway.app)** and sign in (GitHub is fastest).
2. Click **"New Project"**.
3. Choose **"Deploy from GitHub repo"**.
4. Select **`Siddhant-Sarkar73/lensmatch-india`** (or your fork). Authorize Railway if asked.

## 2. Use the `backend` folder as the service root

1. In the new service, open **Settings** (or the service name).
2. Under **Source**, set **Root Directory** to: **`backend`**.
3. Save. Railway will rebuild from the `backend` folder.

## 3. Add PostgreSQL

1. In the same project, click **"+ New"**.
2. Select **"Database"** → **"PostgreSQL"**.
3. After it’s created, open the PostgreSQL service → **Variables** (or **Connect**).
4. Copy **`DATABASE_URL`** (you’ll add it to the backend in the next step).

## 4. Set backend environment variables

1. Open your **backend service** (the one with Root Directory `backend`).
2. Go to **Variables** and add (replace placeholders with your values):

| Variable | Example / note |
|----------|-----------------|
| `DATABASE_URL` | Paste from PostgreSQL service (Railway can also link it via “Add variable reference”). |
| `PORT` | Optional; Railway sets this. |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGIN` | Your frontend URL, e.g. `https://siddhant-sarkar73.github.io` (or custom domain). |
| `FLIPKART_AFFILIATE_ID` | From [affiliate.flipkart.com](https://affiliate.flipkart.com). |
| `FLIPKART_AFFILIATE_TOKEN` | From Flipkart affiliate API token page. |
| `BREVO_SMTP_USER` | Your Brevo login email. |
| `BREVO_SMTP_PASS` | Brevo SMTP key. |
| `FROM_EMAIL` | e.g. `alerts@yourdomain.com` |
| `FROM_NAME` | `LensMatch India` |
| `PUPPETEER_SKIP_DOWNLOAD` | `1` (recommended on Railway so install is faster; Amazon scraping may need extra setup later). |

3. If you added PostgreSQL in the same project, use **“Add variable reference”** and pick **PostgreSQL → DATABASE_URL** instead of pasting.

## 5. Run database migrations

1. In the backend service, open **Settings** → **Deploy** (or use the **Shell** / **One-off command** if Railway offers it).
2. Run the schema once. Options:
   - **Railway CLI:**  
     `railway run psql $DATABASE_URL -f db/schema.sql`
   - Or from your machine (with `DATABASE_URL` from Railway):  
     `psql "<paste DATABASE_URL>" -f backend/db/schema.sql`

## 6. Deploy and get the URL

1. Trigger a deploy (push to the connected branch, or **Deploy** in the dashboard).
2. In the backend service, open **Settings** → **Networking** → **Generate domain** (or use the default if one exists).
3. Copy the public URL, e.g. `https://lensmatch-india-backend-production.up.railway.app`.

## 7. Point the frontend at the backend

1. In your **GitHub repo** (or wherever the frontend is built), set the build-time variable for the API:
   - Name: `VITE_API_URL`  
   - Value: your Railway backend URL, e.g. `https://lensmatch-india-backend-production.up.railway.app`
2. Rebuild/redeploy the frontend so it uses this URL for `/api/*` requests.

## Optional: Watch only `backend` (monorepo)

In the backend service **Settings** → **Source**, you can set **Watch Paths** to `backend/**` so only changes under `backend` trigger new deploys.

---

**Troubleshooting**

- **Build fails:** Ensure Root Directory is exactly `backend` and that `backend/package.json` has a `"start": "node server.js"` script.
- **DB connection errors:** Confirm `DATABASE_URL` is set and the schema has been applied (step 5).
- **CORS errors from the frontend:** Set `ALLOWED_ORIGIN` to the exact frontend origin (e.g. `https://siddhant-sarkar73.github.io`).
- **Puppeteer / Amazon scraping:** With `PUPPETEER_SKIP_DOWNLOAD=1`, the app will start; Amazon scraping may need a Chromium buildpack or a separate browser service later.
