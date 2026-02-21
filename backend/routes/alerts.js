const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');

const router = express.Router();

// Validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /api/alerts
// Create or update price alert
router.post('/', async (req, res, next) => {
  try {
    const { email, lensId, targetPrice, consent } = req.body;

    // Validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    if (!lensId) {
      return res.status(400).json({ error: 'lensId is required' });
    }

    if (!targetPrice || typeof targetPrice !== 'number' || targetPrice <= 0) {
      return res.status(400).json({ error: 'targetPrice must be a positive number' });
    }

    if (typeof consent !== 'boolean') {
      return res.status(400).json({ error: 'consent must be a boolean' });
    }

    const unsubscribeToken = uuidv4();

    // Upsert: insert or update if email+lensId already exists
    const upsertQuery = `
      INSERT INTO price_alerts (email, lens_id, target_price, consent, unsubscribe_token)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email, lens_id) 
      DO UPDATE SET 
        target_price = $3,
        consent = $4,
        unsubscribe_token = $5,
        triggered_at = NULL
      RETURNING id, email, lens_id, target_price, consent, unsubscribe_token, created_at
    `;

    const result = await query(upsertQuery, [
      email,
      lensId,
      targetPrice,
      consent,
      unsubscribeToken
    ]);

    const alert = result.rows[0];

    res.status(201).json({
      id: alert.id,
      email: alert.email,
      lensId: alert.lens_id,
      targetPrice: alert.target_price,
      consent: alert.consent,
      unsubscribeToken: alert.unsubscribe_token,
      createdAt: alert.created_at,
      message: 'Alert created successfully'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/alerts/unsubscribe?token=X
// Unsubscribe from alert using token
router.get('/unsubscribe', async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Unsubscribe token is required' });
    }

    // Find alert by token
    const findQuery = `
      SELECT id, email, lens_id FROM price_alerts WHERE unsubscribe_token = $1
    `;

    const findResult = await query(findQuery, [token]);

    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found or already unsubscribed' });
    }

    const alert = findResult.rows[0];

    // Delete alert
    const deleteQuery = `
      DELETE FROM price_alerts WHERE unsubscribe_token = $1
    `;

    await query(deleteQuery, [token]);

    // Return HTML confirmation
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Unsubscribed - LensMatch India</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 40px 20px; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          h1 { color: #333; margin: 0 0 10px 0; }
          p { color: #666; line-height: 1.6; }
          .success { color: #27ae60; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Unsubscribed Successfully</h1>
          <p class="success">You have been unsubscribed from price alerts for lens <strong>${alert.lens_id}</strong></p>
          <p>Your email <strong>${alert.email}</strong> will no longer receive notifications.</p>
          <p>If you change your mind, you can subscribe again anytime from our website.</p>
        </div>
      </body>
      </html>
    `;

    res.type('text/html').send(html);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
