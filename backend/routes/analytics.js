const express = require('express');
const { query } = require('../db');

const router = express.Router();

// Valid event types
const VALID_EVENTS = [
  'quiz_start',
  'quiz_complete',
  'lens_view',
  'catalogue_filter',
  'rent_city_select',
  'alert_signup',
  'price_refresh'
];

// POST /api/analytics/event
// Track user events
router.post('/event', async (req, res, next) => {
  try {
    const { event, lensId, sessionId } = req.body;

    // Validation
    if (!event || typeof event !== 'string') {
      return res.status(400).json({ error: 'event is required and must be a string' });
    }

    if (!VALID_EVENTS.includes(event)) {
      return res.status(400).json({
        error: `Invalid event type. Must be one of: ${VALID_EVENTS.join(', ')}`
      });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required and must be a string' });
    }

    // lensId is optional
    if (lensId && typeof lensId !== 'string') {
      return res.status(400).json({ error: 'lensId must be a string if provided' });
    }

    // Insert event into database
    const insertQuery = `
      INSERT INTO analytics_events (event, lens_id, session_id)
      VALUES ($1, $2, $3)
      RETURNING id, event, lens_id, session_id, created_at
    `;

    const result = await query(insertQuery, [event, lensId || null, sessionId]);

    const analyticsEvent = result.rows[0];

    res.status(201).json({
      id: analyticsEvent.id,
      event: analyticsEvent.event,
      lensId: analyticsEvent.lens_id,
      sessionId: analyticsEvent.session_id,
      createdAt: analyticsEvent.created_at,
      message: 'Event tracked successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
