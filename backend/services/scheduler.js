const cron = require('node-cron');
const { query } = require('../db');
const flipkart = require('./flipkart');
const amazon = require('./amazon');
const mailer = require('./mailer');
const fs = require('fs');
const path = require('path');

// Function to load lens data
const loadLenses = () => {
  try {
    // TODO: Update path once frontend structure is finalized
    const lensesPath = path.join(__dirname, '../../src/data/lenses.json');
    if (!fs.existsSync(lensesPath)) {
      console.warn(`Lenses file not found at ${lensesPath}`);
      return [];
    }
    const data = fs.readFileSync(lensesPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading lenses data:', err.message);
    return [];
  }
};

/**
 * Fetch prices for a single lens
 * @param {Object} lens - Lens object with id and name
 * @returns {Promise<void>}
 */
const fetchPricesForLens = async (lens) => {
  try {
    console.log(`Fetching prices for ${lens.name} (${lens.id})...`);

    // Fetch from both platforms
    const [flipkartResult, amazonResult] = await Promise.all([
      flipkart.fetchFlipkartPrice(lens.name, lens.id),
      amazon.fetchAmazonPrice(lens.name, lens.id)
    ]);

    // Store Flipkart price if available
    if (flipkartResult && flipkartResult.price) {
      await storePrice({
        lensId: lens.id,
        platform: 'flipkart',
        price: flipkartResult.price,
        url: flipkartResult.url,
        sourceType: 'api'
      });
    }

    // Store Amazon price if available
    if (amazonResult && amazonResult.price) {
      await storePrice({
        lensId: lens.id,
        platform: 'amazon',
        price: amazonResult.price,
        url: amazonResult.url,
        sourceType: 'scraped'
      });
    }

    // Check and trigger alerts
    await checkAndTriggerAlerts(lens.id);

    console.log(`Completed price fetch for ${lens.name}`);
  } catch (err) {
    console.error(`Error fetching prices for ${lens.name}:`, err.message);
  }
};

/**
 * Store price snapshot in database
 * @param {Object} data - Price data
 * @returns {Promise<void>}
 */
const storePrice = async (data) => {
  try {
    const { lensId, platform, price, url, sourceType } = data;

    const insertQuery = `
      INSERT INTO price_snapshots (lens_id, platform, price, url, source_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const result = await query(insertQuery, [lensId, platform, price, url, sourceType]);
    console.log(`Stored price snapshot for ${lensId} on ${platform}: ₹${price}`);
  } catch (err) {
    console.error('Error storing price:', err.message);
  }
};

/**
 * Check price alerts and trigger emails
 * @param {string} lensId - Lens ID
 * @returns {Promise<void>}
 */
const checkAndTriggerAlerts = async (lensId) => {
  try {
    // Get all active alerts for this lens
    const alertsQuery = `
      SELECT pa.id, pa.email, pa.target_price, pa.unsubscribe_token, pa.lens_id
      FROM price_alerts pa
      WHERE pa.lens_id = $1
        AND pa.consent = true
        AND pa.triggered_at IS NULL
    `;

    const alertsResult = await query(alertsQuery, [lensId]);
    const alerts = alertsResult.rows;

    if (alerts.length === 0) {
      return;
    }

    // Get latest prices
    const pricesQuery = `
      SELECT DISTINCT ON (platform) 
        platform, price, url
      FROM price_snapshots
      WHERE lens_id = $1
      ORDER BY platform, created_at DESC
    `;

    const pricesResult = await query(pricesQuery, [lensId]);
    const prices = pricesResult.rows;

    // Check each alert against latest prices
    for (const alert of alerts) {
      for (const priceSnapshot of prices) {
        // If current price is at or below target price
        if (priceSnapshot.price <= alert.target_price) {
          // Send email
          try {
            await mailer.sendPriceAlert({
              to: alert.email,
              lensName: lensId, // TODO: Get actual lens name
              price: priceSnapshot.price,
              platform: priceSnapshot.platform,
              buyUrl: priceSnapshot.url,
              unsubscribeToken: alert.unsubscribe_token
            });

            // Mark alert as triggered
            const updateQuery = `
              UPDATE price_alerts
              SET triggered_at = NOW()
              WHERE id = $1
            `;

            await query(updateQuery, [alert.id]);
            console.log(`Triggered alert for ${alert.email}`);
          } catch (err) {
            console.error(`Error sending alert email to ${alert.email}:`, err.message);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error checking alerts:', err.message);
  }
};

/**
 * Main scheduler job - runs at 6AM and 6PM IST
 */
const runScheduler = async () => {
  try {
    console.log(`[${new Date().toISOString()}] Starting price refresh scheduler`);

    const lenses = loadLenses();

    if (lenses.length === 0) {
      console.warn('No lenses found. Skipping price refresh.');
      return;
    }

    console.log(`Processing ${lenses.length} lenses...`);

    // Process lenses sequentially with 3 second delay between each
    for (const lens of lenses) {
      await fetchPricesForLens(lens);
      // Wait 3 seconds before next lens
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log(`[${new Date().toISOString()}] Price refresh scheduler completed`);
  } catch (err) {
    console.error('Scheduler error:', err.message);
  }
};

/**
 * Start the scheduler
 * Runs at 6 AM and 6 PM IST (0:30 and 12:30 UTC)
 */
const start = () => {
  try {
    // Schedule at 6 AM IST (0:30 UTC)
    cron.schedule('30 0 * * *', () => {
      console.log('Running scheduled price refresh (6 AM IST)');
      runScheduler();
    });

    // Schedule at 6 PM IST (12:30 UTC)
    cron.schedule('30 12 * * *', () => {
      console.log('Running scheduled price refresh (6 PM IST)');
      runScheduler();
    });

    console.log('Scheduler initialized. Jobs scheduled for 6 AM and 6 PM IST');
  } catch (err) {
    console.error('Error starting scheduler:', err.message);
    throw err;
  }
};

// Allow manual trigger for development
const runOnce = () => {
  console.log('Manually triggering scheduler...');
  runScheduler();
};

module.exports = {
  start,
  runOnce,
  runScheduler,
  fetchPricesForLens,
  checkAndTriggerAlerts
};
