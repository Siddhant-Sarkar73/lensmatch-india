const express = require('express');
const path = require('path');
const fs = require('fs');
const { query } = require('../db');
const { refreshLimit } = require('../middleware/rateLimit');
const flipkart = require('../services/flipkart');
const amazon = require('../services/amazon');

const router = express.Router();

/**
 * Build GET response shape: { amazon, flipkart, history } for frontend/CURSOR spec.
 * @param {Array} latestRows - Rows from distinct-on latest query (platform, price, url, created_at)
 * @param {Array} historyRows - Rows from 30-day history query
 */
function buildPricesResponse(latestRows, historyRows) {
  const latestByPlatform = {};
  (latestRows || []).forEach(row => {
    latestByPlatform[row.platform] = {
      price: row.price,
      url: row.url,
      updatedAt: row.created_at ? new Date(row.created_at).toISOString() : null
    };
  });
  const amazon = (latestByPlatform.amazon && latestByPlatform.amazon.price != null)
    ? latestByPlatform.amazon
    : null;
  const flipkart = (latestByPlatform.flipkart && latestByPlatform.flipkart.price != null)
    ? latestByPlatform.flipkart
    : null;
  const byDate = {};
  (historyRows || []).forEach(row => {
    const d = row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : null;
    if (d && row.price != null) {
      if (!byDate[d] || new Date(row.created_at) > new Date(byDate[d].created_at)) {
        byDate[d] = { date: d, price: row.price, created_at: row.created_at };
      }
    }
  });
  const history = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ date, price }) => ({ date, price }));
  return { amazon, flipkart, history };
}

function loadLenses() {
  const lensesPath = path.join(__dirname, '../../src/data/lenses.json');
  try {
    if (!fs.existsSync(lensesPath)) return [];
    const data = fs.readFileSync(lensesPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading lenses:', err.message);
    return [];
  }
}

// GET /api/prices/:lensId
// Returns latest prices from both platforms + 30 days history (CURSOR spec shape)
router.get('/:lensId', async (req, res, next) => {
  try {
    const { lensId } = req.params;

    if (!lensId) {
      return res.status(400).json({ error: 'lensId is required' });
    }

    const latestQuery = `
      SELECT DISTINCT ON (platform)
        lens_id, platform, price, url, source_type, created_at
      FROM price_snapshots
      WHERE lens_id = $1
      ORDER BY platform, created_at DESC
    `;

    const historyQuery = `
      SELECT lens_id, platform, price, url, source_type, created_at
      FROM price_snapshots
      WHERE lens_id = $1
        AND created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
    `;

    const [latestRes, historyRes] = await Promise.all([
      query(latestQuery, [lensId]),
      query(historyQuery, [lensId])
    ]);

    const body = buildPricesResponse(latestRes.rows, historyRes.rows);
    res.json(body);
  } catch (err) {
    next(err);
  }
});

// POST /api/prices/refresh/:lensId
// Trigger fresh scrape/API call for a specific lens
router.post('/refresh/:lensId', refreshLimit, async (req, res, next) => {
  try {
    const { lensId } = req.params;

    if (!lensId) {
      return res.status(400).json({ error: 'lensId is required' });
    }

    const lenses = loadLenses();
    const lens = lenses.find(l => l.id === lensId);
    if (!lens) {
      return res.status(400).json({ error: 'Unknown lens' });
    }

    const lensName = [lens.brand, lens.name].filter(Boolean).join(' ') || lens.name;

    const [amazonResult, flipkartResult] = await Promise.all([
      amazon.fetchAmazonPrice(lensName, lensId),
      flipkart.fetchFlipkartPrice(lensName, lensId)
    ]);

    const now = new Date().toISOString();
    const insertQuery = `
      INSERT INTO price_snapshots (lens_id, platform, price, url, source_type)
      VALUES ($1, $2, $3, $4, $5)
    `;

    if (amazonResult && amazonResult.price > 0) {
      await query(insertQuery, [lensId, 'amazon', amazonResult.price, amazonResult.url || null, 'scraped']);
    }
    if (flipkartResult && flipkartResult.price > 0) {
      await query(insertQuery, [lensId, 'flipkart', flipkartResult.price, flipkartResult.url || null, 'api']);
    }

    const amazonPayload = amazonResult && amazonResult.price > 0
      ? { price: amazonResult.price, url: amazonResult.url || null, updatedAt: now }
      : null;
    const flipkartPayload = flipkartResult && flipkartResult.price > 0
      ? { price: flipkartResult.price, url: flipkartResult.url || null, updatedAt: now }
      : null;

    res.json({
      success: true,
      amazon: amazonPayload,
      flipkart: flipkartPayload
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
module.exports.buildPricesResponse = buildPricesResponse;
