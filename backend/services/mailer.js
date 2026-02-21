const nodemailer = require('nodemailer');

// Create SMTP transporter using Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS
  }
});

/**
 * Generate HTML email template for price alert
 */
const generateEmailHTML = (data) => {
  const {
    lensName,
    price,
    platform,
    buyUrl,
    unsubscribeToken
  } = data;

  const unsubscribeUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/alerts/unsubscribe?token=${unsubscribeToken}`;
  const priceFormatted = price.toLocaleString('en-IN');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Price Alert - LensMatch India</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .price-box { background: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .price-box h2 { margin: 0 0 10px 0; color: #333; font-size: 18px; }
        .price { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
        .platform { color: #666; font-size: 14px; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; }
        .unsubscribe { color: #999; font-size: 11px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LensMatch India</h1>
          <p>Your Price Alert</p>
        </div>

        <div class="content">
          <h2>Great news!</h2>
          <p>The price for <strong>${lensName}</strong> has dropped to your target!</p>

          <div class="price-box">
            <h2>${lensName}</h2>
            <div class="price">₹${priceFormatted}</div>
            <div class="platform">Available on ${platform}</div>
          </div>

          <p>This lens is now available at your target price. Don't miss out!</p>

          <a href="${buyUrl}" class="cta-button" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold;">
            View on ${platform}
          </a>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 13px;">
            You're receiving this email because you subscribed to price alerts on LensMatch India. 
            <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Unsubscribe from this lens</a>
          </p>
        </div>

        <div class="footer">
          <p>LensMatch India — Smart Lens Shopping</p>
          <p class="unsubscribe">
            <a href="${unsubscribeUrl}" style="color: #999; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send price alert email
 * @param {Object} data - Email data
 * @param {string} data.to - Recipient email
 * @param {string} data.lensName - Name of the lens
 * @param {number} data.price - Price in INR
 * @param {string} data.platform - Platform name (amazon/flipkart)
 * @param {string} data.buyUrl - URL to purchase page
 * @param {string} data.unsubscribeToken - Token for unsubscribe link
 * @returns {Promise<void>}
 */
const sendPriceAlert = async (data) => {
  try {
    const {
      to,
      lensName,
      price,
      platform,
      buyUrl,
      unsubscribeToken
    } = data;

    // Validation
    if (!to || !lensName || !price || !platform || !buyUrl || !unsubscribeToken) {
      throw new Error('Missing required email data');
    }

    const htmlContent = generateEmailHTML(data);

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to,
      subject: `Price Alert: ${lensName} now at ₹${price.toLocaleString('en-IN')}`,
      html: htmlContent,
      replyTo: process.env.FROM_EMAIL
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', { messageId: info.messageId, to });

    return info;
  } catch (err) {
    console.error('Error sending price alert email:', err.message);
    throw err;
  }
};

/**
 * Test email connection
 * @returns {Promise<void>}
 */
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email service connected successfully');
  } catch (err) {
    console.error('Email service connection failed:', err.message);
  }
};

module.exports = {
  sendPriceAlert,
  testConnection
};
