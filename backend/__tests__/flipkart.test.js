jest.mock('https');

const https = require('https');
const { fetchFlipkartPrice } = require('../services/flipkart');

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

function mockRequestReturn() {
  const req = { on: jest.fn().mockReturnThis(), end: jest.fn() };
  return req;
}

describe('fetchFlipkartPrice', () => {
  test('returns null when FLIPKART_AFFILIATE_ID is missing', async () => {
    delete process.env.FLIPKART_AFFILIATE_ID;
    process.env.FLIPKART_AFFILIATE_TOKEN = 'token';
    const result = await fetchFlipkartPrice('Nikon 50mm', 'nk-50');
    expect(result).toBeNull();
  });

  test('returns null when FLIPKART_AFFILIATE_TOKEN is missing', async () => {
    process.env.FLIPKART_AFFILIATE_ID = 'id';
    delete process.env.FLIPKART_AFFILIATE_TOKEN;
    const result = await fetchFlipkartPrice('Nikon 50mm', 'nk-50');
    expect(result).toBeNull();
  });

  test('returns { price, url } when API returns 200 with products', async () => {
    process.env.FLIPKART_AFFILIATE_ID = 'testid';
    process.env.FLIPKART_AFFILIATE_TOKEN = 'testtoken';

    const mockBody = JSON.stringify({
      products: [
        {
          productBaseInfoV1: {
            sellingPrice: 29999,
            productUrl: 'https://flipkart.com/nikon-50mm'
          }
        }
      ]
    });

    https.request.mockImplementation((url, options, callback) => {
      const res = {
        statusCode: 200,
        on: (ev, fn) => {
          if (ev === 'data') setImmediate(() => fn(mockBody));
          if (ev === 'end') setImmediate(() => fn());
        }
      };
      setImmediate(() => callback(res));
      return mockRequestReturn();
    });

    const result = await fetchFlipkartPrice('Nikon 50mm', 'nk-50');
    expect(result).toEqual({ price: 29999, url: 'https://flipkart.com/nikon-50mm' });
  });

  test('returns null when API returns non-200', async () => {
    process.env.FLIPKART_AFFILIATE_ID = 'testid';
    process.env.FLIPKART_AFFILIATE_TOKEN = 'testtoken';

    https.request.mockImplementation((url, options, callback) => {
      const res = { statusCode: 404, on: (ev, fn) => { if (ev === 'end') setImmediate(() => fn()); } };
      setImmediate(() => callback(res));
      return mockRequestReturn();
    });

    const result = await fetchFlipkartPrice('Nikon 50mm', 'nk-50');
    expect(result).toBeNull();
  });

  test('returns null when response JSON has no products', async () => {
    process.env.FLIPKART_AFFILIATE_ID = 'testid';
    process.env.FLIPKART_AFFILIATE_TOKEN = 'testtoken';

    https.request.mockImplementation((url, options, callback) => {
      const res = {
        statusCode: 200,
        on: (ev, fn) => {
          if (ev === 'data') setImmediate(() => fn('{}'));
          if (ev === 'end') setImmediate(() => fn());
        }
      };
      setImmediate(() => callback(res));
      return mockRequestReturn();
    });

    const result = await fetchFlipkartPrice('Nikon 50mm', 'nk-50');
    expect(result).toBeNull();
  });
});
