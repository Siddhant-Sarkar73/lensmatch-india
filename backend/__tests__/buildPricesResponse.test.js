const { buildPricesResponse } = require('../routes/prices');

describe('buildPricesResponse', () => {
  test('returns amazon and flipkart null and empty history when no rows', () => {
    const out = buildPricesResponse([], []);
    expect(out).toEqual({ amazon: null, flipkart: null, history: [] });
  });

  test('returns single platform when only one latest row', () => {
    const latest = [
      { platform: 'amazon', price: 31000, url: 'https://amazon.in/dp/1', created_at: '2024-02-15T06:00:00Z' }
    ];
    const out = buildPricesResponse(latest, []);
    expect(out.amazon).toEqual({ price: 31000, url: 'https://amazon.in/dp/1', updatedAt: '2024-02-15T06:00:00.000Z' });
    expect(out.flipkart).toBeNull();
    expect(out.history).toEqual([]);
  });

  test('returns both platforms with updatedAt', () => {
    const latest = [
      { platform: 'amazon', price: 31500, url: 'https://amazon.in/dp/1', created_at: '2024-02-15T06:00:00Z' },
      { platform: 'flipkart', price: 30999, url: 'https://flipkart.com/p/1', created_at: '2024-02-15T07:00:00Z' }
    ];
    const out = buildPricesResponse(latest, []);
    expect(out.amazon.price).toBe(31500);
    expect(out.amazon.updatedAt).toBe('2024-02-15T06:00:00.000Z');
    expect(out.flipkart.price).toBe(30999);
    expect(out.flipkart.updatedAt).toBe('2024-02-15T07:00:00.000Z');
    expect(out.history).toEqual([]);
  });

  test('builds history as date and price per day', () => {
    const latest = [];
    const history = [
      { platform: 'amazon', price: 32000, created_at: '2024-01-16T10:00:00Z' },
      { platform: 'amazon', price: 31800, created_at: '2024-01-17T10:00:00Z' }
    ];
    const out = buildPricesResponse(latest, history);
    expect(out.history).toEqual([
      { date: '2024-01-16', price: 32000 },
      { date: '2024-01-17', price: 31800 }
    ]);
  });

  test('dedupes history by date keeping latest snapshot per day', () => {
    const latest = [];
    const history = [
      { platform: 'amazon', price: 32000, created_at: '2024-01-16T08:00:00Z' },
      { platform: 'flipkart', price: 31500, created_at: '2024-01-16T18:00:00Z' }
    ];
    const out = buildPricesResponse(latest, history);
    expect(out.history).toHaveLength(1);
    expect(out.history[0].date).toBe('2024-01-16');
    expect(out.history[0].price).toBe(31500);
  });
});
