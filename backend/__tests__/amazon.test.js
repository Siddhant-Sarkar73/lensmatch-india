const puppeteer = require('puppeteer');

jest.mock('puppeteer');

describe('fetchAmazonPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns { price, url } when page.evaluate returns valid data', async () => {
    const mockPage = {
      setUserAgent: jest.fn().mockResolvedValue(undefined),
      setViewport: jest.fn().mockResolvedValue(undefined),
      goto: jest.fn().mockResolvedValue(undefined),
      waitForSelector: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue({ price: 28500, url: 'https://www.amazon.in/dp/B004Y1AYAC' })
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined)
    };
    puppeteer.launch.mockResolvedValue(mockBrowser);

    const { fetchAmazonPrice } = require('../services/amazon');
    const promise = fetchAmazonPrice('Nikon 50mm f/1.8G', 'nikon-50mm-f1-8g');
    await jest.advanceTimersByTimeAsync(10000);
    const result = await promise;

    expect(result).toEqual({ price: 28500, url: 'https://www.amazon.in/dp/B004Y1AYAC' });
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  test('returns null when page.evaluate returns null (no results)', async () => {
    jest.useRealTimers();
    const mockPage = {
      setUserAgent: jest.fn().mockResolvedValue(undefined),
      setViewport: jest.fn().mockResolvedValue(undefined),
      goto: jest.fn().mockResolvedValue(undefined),
      waitForSelector: jest.fn().mockResolvedValue(undefined),
      evaluate: jest.fn().mockResolvedValue(null)
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined)
    };
    puppeteer.launch.mockResolvedValue(mockBrowser);

    const { fetchAmazonPrice } = require('../services/amazon');
    const result = await fetchAmazonPrice('Nikon 50mm', 'nk-50');

    expect(result).toBeNull();
    expect(mockBrowser.close).toHaveBeenCalled();
    jest.useFakeTimers();
  }, 15000);

  test('returns null after retries when waitForSelector throws', async () => {
    jest.useRealTimers();
    const mockPage = {
      setUserAgent: jest.fn().mockResolvedValue(undefined),
      setViewport: jest.fn().mockResolvedValue(undefined),
      goto: jest.fn().mockResolvedValue(undefined),
      waitForSelector: jest.fn().mockRejectedValue(new Error('Timeout'))
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(undefined)
    };
    puppeteer.launch.mockResolvedValue(mockBrowser);

    const { fetchAmazonPrice } = require('../services/amazon');
    const result = await fetchAmazonPrice('Nikon 50mm', 'nk-50');

    expect(result).toBeNull();
    expect(mockBrowser.close).toHaveBeenCalled();
    jest.useFakeTimers();
  }, 25000);
});
