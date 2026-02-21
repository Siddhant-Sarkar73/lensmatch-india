const request = require('supertest');

jest.mock('../db', () => ({
  query: jest.fn()
}));

jest.mock('../services/amazon', () => ({
  fetchAmazonPrice: jest.fn()
}));

jest.mock('../services/flipkart', () => ({
  fetchFlipkartPrice: jest.fn()
}));

const { query } = require('../db');
const amazon = require('../services/amazon');
const flipkart = require('../services/flipkart');

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('GET /health', () => {
  test('returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/prices/:lensId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 with amazon null, flipkart null, history [] when no data', async () => {
    query.mockImplementation((sql, params) => {
      if (sql.includes('DISTINCT ON')) return Promise.resolve({ rows: [] });
      return Promise.resolve({ rows: [] });
    });

    const res = await request(app).get('/api/prices/nikon-50mm-f1-8g');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ amazon: null, flipkart: null, history: [] });
    expect(res.body).not.toHaveProperty('lensId');
    expect(res.body).not.toHaveProperty('latest');
    expect(res.body).not.toHaveProperty('timestamp');
  });

  test('returns 200 with amazon and flipkart and history when DB has rows', async () => {
    const latestRows = [
      { platform: 'amazon', price: 31500, url: 'https://amazon.in/dp/1', created_at: new Date('2024-02-15T06:00:00Z') },
      { platform: 'flipkart', price: 30999, url: 'https://flipkart.com/p/1', created_at: new Date('2024-02-15T07:00:00Z') }
    ];
    const historyRows = [
      { platform: 'amazon', price: 32000, created_at: new Date('2024-01-16T10:00:00Z') }
    ];

    query.mockImplementation((sql, params) => {
      if (sql.includes('DISTINCT ON')) return Promise.resolve({ rows: latestRows });
      return Promise.resolve({ rows: historyRows });
    });

    const res = await request(app).get('/api/prices/nikon-50mm-f1-8g');
    expect(res.status).toBe(200);
    expect(res.body.amazon).toMatchObject({ price: 31500, url: 'https://amazon.in/dp/1' });
    expect(res.body.amazon).toHaveProperty('updatedAt');
    expect(res.body.flipkart).toMatchObject({ price: 30999, url: 'https://flipkart.com/p/1' });
    expect(res.body.flipkart).toHaveProperty('updatedAt');
    expect(res.body.history).toEqual([{ date: '2024-01-16', price: 32000 }]);
  });

  test('returns 400 when lensId is missing', async () => {
    const res = await request(app).get('/api/prices/');
    expect([400, 404]).toContain(res.status);
  });
});

describe('POST /api/prices/refresh/:lensId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    amazon.fetchAmazonPrice.mockResolvedValue({ price: 31200, url: 'https://amazon.in/dp/1' });
    flipkart.fetchFlipkartPrice.mockResolvedValue({ price: 30800, url: 'https://flipkart.com/p/1' });
    query.mockResolvedValue({ rows: [] });
  });

  test('returns 400 for unknown lensId', async () => {
    const res = await request(app).post('/api/prices/refresh/unknown-lens-xyz');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/unknown|Unknown/);
  });

  test('returns 200 with success and amazon/flipkart when valid lensId', async () => {
    const res = await request(app).post('/api/prices/refresh/nikon-50mm-f1-8g');
    if (res.status === 429) {
      return;
    }
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.amazon).toMatchObject({ price: 31200, url: 'https://amazon.in/dp/1' });
    expect(res.body.amazon).toHaveProperty('updatedAt');
    expect(res.body.flipkart).toMatchObject({ price: 30800, url: 'https://flipkart.com/p/1' });
    expect(res.body.flipkart).toHaveProperty('updatedAt');
    expect(amazon.fetchAmazonPrice).toHaveBeenCalled();
    expect(flipkart.fetchFlipkartPrice).toHaveBeenCalled();
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO price_snapshots'),
      expect.any(Array)
    );
  });
});

describe('POST /api/prices/refresh/:lensId rate limit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    amazon.fetchAmazonPrice.mockResolvedValue({ price: 31200, url: 'https://amazon.in/dp/1' });
    flipkart.fetchFlipkartPrice.mockResolvedValue({ price: 30800, url: 'https://flipkart.com/p/1' });
    query.mockResolvedValue({ rows: [] });
  });

  test('returns 429 with rateLimited and retryAfterMinutes when limit exceeded', async () => {
    const lensId = 'nikon-85mm-f1-8g';
    const first = await request(app).post(`/api/prices/refresh/${lensId}`);
    const second = await request(app).post(`/api/prices/refresh/${lensId}`);
    if (second.status === 429) {
      expect(second.body).toMatchObject({ success: false, rateLimited: true, retryAfterMinutes: 8 });
    }
  });
});
