-- Migration: Create Documents and Analytics Tables
-- Description: Adds support for file uploads, document management, and analytics/ML data collection
-- Date: October 16, 2025
-- Phase: 4 Task 2 & 4 (Enhanced)

-- ============================================
-- DOCUMENTS AND FILE MANAGEMENT
-- ============================================

-- Documents table: Stores metadata for all uploaded files
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL, -- Stored filename (unique, sanitized)
  original_filename VARCHAR(255) NOT NULL, -- Original upload name
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL, -- Size in bytes
  storage_path TEXT NOT NULL, -- Full path or S3 key
  storage_type VARCHAR(20) DEFAULT 'local', -- local, s3, gcs
  document_type VARCHAR(50), -- invoice, product, eway-bill, lr, pod, gst-certificate
  entity_type VARCHAR(50), -- order, product, customer, transporter, vehicle
  entity_id INTEGER, -- Related entity ID
  metadata JSONB DEFAULT '{}', -- Additional data (dimensions, resolution, extracted text preview)
  uploaded_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT FALSE, -- For future OCR/ML processing
  processed_at TIMESTAMP,
  processing_error TEXT, -- Error message if processing failed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for documents
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_uploaded ON documents(uploaded_at);
CREATE INDEX idx_documents_processed ON documents(processed);

-- Document versions table: Track document history
CREATE TABLE IF NOT EXISTS document_versions (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by INTEGER NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  change_note TEXT,
  UNIQUE(document_id, version_number)
);

CREATE INDEX idx_document_versions_document ON document_versions(document_id);

-- ============================================
-- ANALYTICS AND EVENT TRACKING
-- ============================================

-- Analytics events table: Stores all user and system events
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL, -- page_view, order_created, product_added, search, export, etc.
  event_category VARCHAR(50), -- user_action, system_event, business_metric, error
  event_data JSONB DEFAULT '{}', -- Flexible event-specific data
  session_id VARCHAR(100), -- Session identifier
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for analytics events
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_event_data ON analytics_events USING GIN(event_data);

-- Business metrics table: Aggregated data for ML/AI training
CREATE TABLE IF NOT EXISTS business_metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(100) NOT NULL, -- delivery_time, route_cost, order_value, stock_turnover, etc.
  metric_value NUMERIC NOT NULL,
  metric_unit VARCHAR(50), -- seconds, rupees, units, percentage, etc.
  entity_type VARCHAR(50), -- order, route, product, customer
  entity_id INTEGER, -- Related entity ID
  metadata JSONB DEFAULT '{}', -- Context: route details, weather, traffic, etc.
  recorded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for business metrics
CREATE INDEX idx_metrics_user ON business_metrics(user_id);
CREATE INDEX idx_metrics_type ON business_metrics(metric_type);
CREATE INDEX idx_metrics_entity ON business_metrics(entity_type, entity_id);
CREATE INDEX idx_metrics_recorded ON business_metrics(recorded_at);
CREATE INDEX idx_metrics_metadata ON business_metrics USING GIN(metadata);

-- User sessions table: Track user sessions for analytics
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL UNIQUE,
  device_id VARCHAR(255), -- From device fingerprinting
  ip_address INET,
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(50), -- mobile, tablet, desktop
  started_at TIMESTAMP DEFAULT NOW(),
  last_activity_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_seconds INTEGER, -- Calculated on session end
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for user sessions
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_sessions_device ON user_sessions(device_id);
CREATE INDEX idx_sessions_started ON user_sessions(started_at);

-- Aggregated metrics table: Pre-computed analytics for dashboards
CREATE TABLE IF NOT EXISTS aggregated_metrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL, -- daily_orders, monthly_revenue, avg_delivery_time
  metric_period VARCHAR(20) NOT NULL, -- hourly, daily, weekly, monthly
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit VARCHAR(50),
  breakdown JSONB DEFAULT '{}', -- Breakdown by category, region, etc.
  calculated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, metric_name, metric_period, period_start)
);

-- Indexes for aggregated metrics
CREATE INDEX idx_agg_metrics_user ON aggregated_metrics(user_id);
CREATE INDEX idx_agg_metrics_name ON aggregated_metrics(metric_name);
CREATE INDEX idx_agg_metrics_period ON aggregated_metrics(metric_period, period_start);

-- ============================================
-- EMAIL TRACKING
-- ============================================

-- Email logs table: Track all outgoing emails
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject TEXT NOT NULL,
  email_type VARCHAR(50), -- invoice, report, notification, alert, password_reset
  template_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed, bounced
  sent_at TIMESTAMP,
  failed_at TIMESTAMP,
  error_message TEXT,
  attachments JSONB DEFAULT '[]', -- Array of {filename, size, type}
  metadata JSONB DEFAULT '{}', -- Related entity IDs, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for email logs
CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_created ON email_logs(created_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update updated_at timestamp for documents
CREATE OR REPLACE FUNCTION update_document_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_document_timestamp();

-- Trigger to auto-increment document version numbers
CREATE OR REPLACE FUNCTION set_document_version_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO NEW.version_number
  FROM document_versions
  WHERE document_id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_versions_auto_increment
BEFORE INSERT ON document_versions
FOR EACH ROW
WHEN (NEW.version_number IS NULL)
EXECUTE FUNCTION set_document_version_number();

-- Trigger to update session duration and last activity
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity_at = NOW();
  IF NEW.ended_at IS NOT NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_sessions_activity
BEFORE UPDATE ON user_sessions
FOR EACH ROW
EXECUTE FUNCTION update_session_activity();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Recent documents with user info
CREATE OR REPLACE VIEW vw_recent_documents AS
SELECT 
  d.id,
  d.filename,
  d.original_filename,
  d.document_type,
  d.entity_type,
  d.entity_id,
  d.file_size,
  d.uploaded_at,
  d.processed,
  u.name AS uploaded_by_name,
  u.email AS uploaded_by_email
FROM documents d
JOIN users u ON d.user_id = u.id
ORDER BY d.uploaded_at DESC;

-- View: User activity summary
CREATE OR REPLACE VIEW vw_user_activity_summary AS
SELECT 
  u.id AS user_id,
  u.name,
  u.email,
  COUNT(DISTINCT s.id) AS total_sessions,
  COUNT(DISTINCT ae.id) AS total_events,
  MAX(s.last_activity_at) AS last_activity,
  SUM(s.duration_seconds) AS total_time_seconds,
  COUNT(DISTINCT d.id) AS documents_uploaded
FROM users u
LEFT JOIN user_sessions s ON u.id = s.user_id
LEFT JOIN analytics_events ae ON u.id = ae.user_id
LEFT JOIN documents d ON u.id = d.user_id
GROUP BY u.id, u.name, u.email;

-- View: Daily metrics summary
CREATE OR REPLACE VIEW vw_daily_metrics AS
SELECT 
  DATE(recorded_at) AS metric_date,
  metric_type,
  COUNT(*) AS count,
  AVG(metric_value) AS avg_value,
  MIN(metric_value) AS min_value,
  MAX(metric_value) AS max_value,
  SUM(metric_value) AS total_value,
  metric_unit
FROM business_metrics
GROUP BY DATE(recorded_at), metric_type, metric_unit
ORDER BY metric_date DESC, metric_type;

-- ============================================
-- SAMPLE DATA (FOR DEVELOPMENT ONLY)
-- ============================================

-- Insert sample analytics event
-- INSERT INTO analytics_events (user_id, event_type, event_category, event_data, session_id)
-- VALUES (1, 'page_view', 'user_action', '{"page": "/dashboard", "load_time_ms": 234}', 'session_123');

-- Insert sample business metric
-- INSERT INTO business_metrics (user_id, metric_type, metric_value, metric_unit, entity_type, entity_id)
-- VALUES (1, 'delivery_time', 3600, 'seconds', 'order', 1);

-- ============================================
-- CLEANUP FUNCTIONS (FOR MAINTENANCE)
-- ============================================

-- Function to clean up old analytics events (keep last 6 months)
CREATE OR REPLACE FUNCTION cleanup_old_analytics_events()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM analytics_events
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate daily metrics (run nightly)
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE)
RETURNS INTEGER AS $$
DECLARE
  inserted_count INTEGER := 0;
BEGIN
  -- Example: Aggregate daily order count
  INSERT INTO aggregated_metrics (user_id, metric_name, metric_period, period_start, period_end, metric_value, metric_unit)
  SELECT 
    user_id,
    'daily_orders',
    'daily',
    target_date::TIMESTAMP,
    (target_date + INTERVAL '1 day')::TIMESTAMP,
    COUNT(*),
    'count'
  FROM orders
  WHERE DATE(created_at) = target_date
  GROUP BY user_id
  ON CONFLICT (user_id, metric_name, metric_period, period_start) 
  DO UPDATE SET 
    metric_value = EXCLUDED.metric_value,
    calculated_at = NOW();
  
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PERMISSIONS (Adjust based on your roles)
-- ============================================

-- Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE ON documents TO logisync_app;
-- GRANT SELECT, INSERT ON analytics_events TO logisync_app;
-- GRANT SELECT, INSERT ON business_metrics TO logisync_app;
-- GRANT SELECT, INSERT, UPDATE ON user_sessions TO logisync_app;
-- GRANT SELECT ON vw_recent_documents TO logisync_app;
-- GRANT SELECT ON vw_user_activity_summary TO logisync_app;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify tables created
DO $$
BEGIN
  RAISE NOTICE '✅ Migration 008 complete:';
  RAISE NOTICE '   - documents table created';
  RAISE NOTICE '   - document_versions table created';
  RAISE NOTICE '   - analytics_events table created';
  RAISE NOTICE '   - business_metrics table created';
  RAISE NOTICE '   - user_sessions table created';
  RAISE NOTICE '   - aggregated_metrics table created';
  RAISE NOTICE '   - email_logs table created';
  RAISE NOTICE '   - Triggers and views created';
  RAISE NOTICE '   - Ready for Task 2 & 4 implementation';
END $$;
