-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Index for faster token lookups
  INDEX idx_verification_token (token),
  INDEX idx_verification_user_id (user_id),
  INDEX idx_verification_expires (expires_at)
);

-- Add comment
COMMENT ON TABLE email_verification_tokens IS 'Stores email verification tokens for new user registrations';
