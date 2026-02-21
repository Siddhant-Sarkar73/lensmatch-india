const puppeteer = require('puppeteer');

// Realistic user agents
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
];

/**
 * Get random user agent
 */
const getRandomUserAgent = () => {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
};

/**
 * Wait for random delay between 2-5 seconds
 */
const randomDelay = async () => {
  const delay = Math.random() * 3000 + 2000; // 2-5 seconds
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Fetch price from Amazon India
 * @param {string} lensName - Name of the lens to search
 * @param {string} lensId - ID of the lens
 * @returns {Promise<{price: number, url: string} | null>}
 */
const fetchAmazonPrice = async (lensName, lensId) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Set user agent for anti-blocking
    await page.setUserAgent(getRandomUserAgent());

    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Retry logic (3 attempts)
    const maxRetries = 3;
    let attempt = 0;
    let result = null;

    while (attempt < maxRetries && !result) {
      try {
        attempt++;

        // Navigate to Amazon India
        const searchQuery = encodeURIComponent(lensName);
        const url = `https://www.amazon.in/s?k=${searchQuery}`;

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Random delay to avoid detection
        await randomDelay();

        // Wait for search results to load
        await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });

        // Extract price and URL from first organic result
        const extracted = await page.evaluate(() => {
          const results = document.querySelectorAll('[data-component-type="s-search-result"]');
          const baseUrl = 'https://www.amazon.in';
          for (const el of results) {
            const sponsored = el.querySelector('.s-sponsored-label-text, [data-component-type="s-ad-result"]');
            if (sponsored) continue;
            const priceEl = el.querySelector('.a-price-whole');
            const linkEl = el.querySelector('a.a-link-normal.s-no-outline[href*="/dp/"], a.a-link-normal.s-no-outline[href*="/gp/product/"]');
            if (!priceEl || !linkEl) continue;
            const priceText = (priceEl.textContent || '').replace(/[^0-9]/g, '');
            const price = parseInt(priceText, 10);
            let href = (linkEl.getAttribute('href') || '').trim();
            if (href && !href.startsWith('http')) href = baseUrl + (href.startsWith('/') ? '' : '/') + href;
            if (price > 0 && href) return { price, url: href };
          }
          return null;
        });

        if (extracted && extracted.price > 0 && extracted.url) {
          result = { price: extracted.price, url: extracted.url };
        }
      } catch (err) {
        console.error(`Amazon scrape attempt ${attempt} failed:`, err.message);
        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    return result;
  } catch (err) {
    console.error('fetchAmazonPrice error:', err.message);
    return null;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        console.error('Error closing browser:', err.message);
      }
    }
  }
};

module.exports = {
  fetchAmazonPrice
};
