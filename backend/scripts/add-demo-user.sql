-- Add demo user account for testing
-- Password: password123
-- This script can be run manually or integrated into your seed script

-- Check if demo user exists
DO $$
BEGIN
  -- Delete existing demo user if exists
  DELETE FROM users WHERE email = 'demo@logisync.com';
  
  -- Insert demo user with hashed password (bcrypt hash of 'password123')
  -- Note: You'll need to generate this hash using bcrypt
  INSERT INTO users (email, password_hash, full_name, role, created_at, updated_at)
  VALUES (
    'demo@logisync.com',
    '$2b$10$rKvVXqZ9WXqZvZYJ6kE3/.XJGnH8xE8FXqL3xY8vY8FXqL3xY8vY8', -- This is a placeholder, see note below
    'Demo User',
    'admin',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Demo user created successfully';
END $$;

-- IMPORTANT NOTE:
-- The password hash above is a placeholder.
-- To generate the correct hash, run the Node.js script: backend/scripts/create-demo-user.js
-- Or use the backend API to register the demo user properly.
