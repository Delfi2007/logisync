-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Index for faster token lookups
  INDEX idx_reset_token (token),
  INDEX idx_reset_user_id (user_id),
  INDEX idx_reset_expires (expires_at)
);

-- Add comment
COMMENT ON TABLE password_reset_tokens IS 'Stores password reset tokens with 1-hour expiry';
