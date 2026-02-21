require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { generalLimit, refreshLimit } = require('./middleware/rateLimit');
const scheduler = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(generalLimit);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0' });
});

// Routes
app.use('/api/prices', require('./routes/prices'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start scheduler only when not in test (avoids cron in integration tests)
if (process.env.NODE_ENV !== 'test') {
  try {
    scheduler.start();
    console.log('Scheduler started');
  } catch (err) {
    console.error('Failed to start scheduler:', err.message);
  }
}

// Start server only when run directly (e.g. node server.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
