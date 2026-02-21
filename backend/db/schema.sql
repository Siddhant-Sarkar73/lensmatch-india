-- Create price_snapshots table
CREATE TABLE IF NOT EXISTS price_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lens_id TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('amazon', 'flipkart')),
  price INTEGER NOT NULL,
  url TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('scraped', 'api', 'manual')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for price_snapshots
CREATE INDEX IF NOT EXISTS idx_price_snapshots_lens_platform_created 
  ON price_snapshots(lens_id, platform, created_at DESC);

-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  lens_id TEXT NOT NULL,
  target_price INTEGER NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT true,
  unsubscribe_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  triggered_at TIMESTAMPTZ,
  UNIQUE(email, lens_id)
);

-- Create index for price_alerts lookups
CREATE INDEX IF NOT EXISTS idx_price_alerts_email_lens 
  ON price_alerts(email, lens_id);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  lens_id TEXT,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_created 
  ON analytics_events(event, created_at DESC);
