const https = require('https');

/**
 * Fetch price from Flipkart Affiliate API
 * @param {string} lensName - Name of the lens to search
 * @param {string} lensId - ID of the lens
 * @returns {Promise<{price: number, url: string} | null>}
 */
const fetchFlipkartPrice = async (lensName, lensId) => {
  try {
    const affiliateId = process.env.FLIPKART_AFFILIATE_ID;
    const affiliateToken = process.env.FLIPKART_AFFILIATE_TOKEN;

    if (!affiliateId || !affiliateToken) {
      console.warn('Flipkart API credentials not configured');
      return null;
    }

    const searchQuery = encodeURIComponent(lensName);
    const apiUrl = `https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query=${searchQuery}&resultCount=10`;

    return new Promise((resolve) => {
      const options = {
        method: 'GET',
        headers: {
          'Fk-Affiliate-Id': affiliateId,
          'Fk-Affiliate-Token': affiliateToken,
          'User-Agent': 'LensMatch-India/2.0'
        }
      };

      const req = https.request(apiUrl, options, (res) => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              console.error(`Flipkart API error: ${res.statusCode}`);
              return resolve(null);
            }
            const json = JSON.parse(data);
            const products = json.products || json.productInfoList || [];
            if (!Array.isArray(products) || products.length === 0) return resolve(null);

            let best = null;
            for (const p of products) {
              const info = p.productBaseInfoV1 || p.productInfo || p;
              const priceObj = info.sellingPrice || info.pricing || info;
              const price = typeof priceObj === 'object'
                ? (priceObj.amount || priceObj.finalPrice || priceObj.sellingPrice)
                : priceObj;
              const url = info.productUrl || p.productUrl || info.url || p.url || '';
              const numPrice = typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, ''), 10);
              if (numPrice > 0 && url) {
                if (!best || numPrice < best.price) best = { price: numPrice, url };
              }
            }
            resolve(best);
          } catch (err) {
            console.error('Error parsing Flipkart response:', err.message);
            resolve(null);
          }
        });
      });

      req.on('error', (err) => {
        console.error('Flipkart API request error:', err.message);
        resolve(null);
      });

      req.end();
    });
  } catch (err) {
    console.error('fetchFlipkartPrice error:', err.message);
    return null;
  }
};

module.exports = {
  fetchFlipkartPrice
};
