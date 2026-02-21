import React, { useState, useEffect } from 'react';
import { RefreshCw, Bell, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PricePanel = ({
  lens,
  prices,
  onRefresh,
  isRefreshing,
}) => {
  const [alertEmail, setAlertEmail] = useState('');
  const [alertConsent, setAlertConsent] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [rateLimitTime, setRateLimitTime] = useState(null);

  // Mock price history data
  const mockPriceHistory = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: Math.floor(25000 + Math.random() * 10000 - (i % 3) * 500),
  })).reverse();

  const currentPrice = prices
    ? Math.min(
        prices.amazon?.price || Infinity,
        prices.flipkart?.price || Infinity
      )
    : lens?.price || 0;

  const averagePrice =
    mockPriceHistory.reduce((sum, item) => sum + item.price, 0) /
    mockPriceHistory.length;

  const isGoodTime = currentPrice < averagePrice * 0.95;

  const handleRefresh = () => {
    onRefresh?.();
    setRefreshSuccess(true);
    setTimeout(() => setRefreshSuccess(false), 3000);
  };

  const handleSetAlert = () => {
    if (!alertEmail || !alertConsent) {
      alert('Please enter email and accept the consent checkbox');
      return;
    }
    setAlertSuccess(true);
    setAlertEmail('');
    setAlertConsent(false);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="w-96 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="card shadow-lg p-6 bg-white rounded-lg">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            Best Price
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-orange">
              {formatPrice(currentPrice)}
            </span>
            {lens?.was && (
              <span className="text-lg text-muted line-through">
                {formatPrice(lens.was)}
              </span>
            )}
          </div>
        </div>

        {/* Platform Prices */}
        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          {/* Amazon */}
          <div className="flex items-center justify-between p-3 bg-cream rounded">
            <div>
              <p className="font-semibold text-orange text-sm">Amazon</p>
              {prices?.amazon ? (
                <p className="text-lg font-bold text-brown">
                  {formatPrice(prices.amazon.price)}
                </p>
              ) : (
                <p className="text-sm text-muted">Loading price...</p>
              )}
            </div>
            {prices?.amazon && (
              <a
                href={prices.amazon.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:text-orange-d transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          {/* Flipkart */}
          <div className="flex items-center justify-between p-3 bg-cream rounded">
            <div>
              <p className="font-semibold text-blue text-sm">Flipkart</p>
              {prices?.flipkart ? (
                <p className="text-lg font-bold text-brown">
                  {formatPrice(prices.flipkart.price)}
                </p>
              ) : (
                <p className="text-sm text-muted">Loading price...</p>
              )}
            </div>
            {prices?.flipkart && (
              <a
                href={prices.flipkart.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:text-blue-d transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`w-full py-2 px-4 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              refreshSuccess
                ? 'bg-green text-white'
                : isRefreshing
                  ? 'bg-muted text-white cursor-not-allowed'
                  : 'bg-orange text-white hover:bg-orange-d'
            }`}
          >
            {refreshSuccess ? (
              <>
                <CheckCircle size={16} /> Updated
              </>
            ) : isRefreshing ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Fetching...
              </>
            ) : rateLimitTime ? (
              <>
                <RefreshCw size={16} /> Try again in {rateLimitTime}m
              </>
            ) : (
              <>
                <RefreshCw size={16} /> Refresh Prices
              </>
            )}
          </button>
          {prices && (
            <p className="text-xs text-muted mt-2">
              Last updated: {formatDate(prices.amazon?.updatedAt || prices.flipkart?.updatedAt)}
            </p>
          )}
        </div>

        {/* Price History Chart */}
        <div className="mb-6 pb-6 border-b border-border">
          <p className="text-xs font-semibold text-brown uppercase tracking-wide mb-3">
            Price History (30 days)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockPriceHistory}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="#bbb"
                style={{ fontSize: '10px' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#bbb"
                style={{ fontSize: '10px' }}
                width={40}
              />
              <Tooltip
                formatter={(value) => formatPrice(value)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ff9500"
                strokeWidth={2}
                isAnimationActive={false}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Buy Signal */}
        <div className="mb-6 pb-6 border-b border-border">
          <div
            className={`p-3 rounded-lg text-center ${
              isGoodTime
                ? 'bg-green-l text-green font-semibold'
                : 'bg-teal-l text-teal-d font-semibold'
            }`}
          >
            {isGoodTime ? 'Good time to buy 🟢' : 'Prices stable'}
          </div>
        </div>

        {/* Buy Buttons */}
        <div className="space-y-2 mb-6 pb-6 border-b border-border">
          {prices?.amazon && (
            <a
              href={prices.amazon.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary block text-center py-3 rounded font-semibold hover:bg-orange-d transition-colors"
            >
              Buy on Amazon
            </a>
          )}
          {prices?.flipkart && (
            <a
              href={prices.flipkart.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary block text-center py-3 rounded font-semibold hover:bg-orange-d transition-colors"
            >
              Buy on Flipkart
            </a>
          )}
        </div>

        {/* Rent Link */}
        <div className="mb-6 pb-6 border-b border-border">
          <Link
            to="/rent"
            className="btn-teal block text-center py-3 rounded font-semibold hover:bg-teal-d transition-colors w-full"
          >
            📍 Rent this lens
          </Link>
        </div>

        {/* Email Alert */}
        <div>
          <p className="text-xs font-semibold text-brown uppercase tracking-wide mb-3">
            Get notified if price drops
          </p>
          {alertSuccess ? (
            <div className="p-3 bg-green-l text-green rounded text-sm font-semibold text-center mb-4">
              ✓ Alert set for this lens!
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="your@email.com"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-cream text-brown placeholder-muted text-sm focus:outline-none focus:ring-2 focus:ring-orange mb-3"
              />
              <label className="flex items-start space-x-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertConsent}
                  onChange={(e) => setAlertConsent(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 accent-orange flex-shrink-0"
                />
                <span className="text-xs text-muted">
                  I agree to receive price alert emails (one email per drop,
                  easy unsubscribe)
                </span>
              </label>
              <button
                onClick={handleSetAlert}
                className="btn-primary w-full py-2 rounded font-semibold text-sm hover:bg-orange-d transition-colors"
              >
                Set Alert
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePanel;
