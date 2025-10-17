-- Migration 007: Enhance authentication system
-- Description: Add new auth tables and enhance users table for JWT authentication with RBAC
-- Created: October 17, 2025

-- ============================================
-- 1. Enhance existing users table
-- ============================================

-- Add new columns to users table if they don't exist
DO $$ 
BEGIN
    -- Add first_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='first_name') THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(255);
        UPDATE users SET first_name = split_part(full_name, ' ', 1);
    END IF;

    -- Add last_name column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='last_name') THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(255);
        UPDATE users SET last_name = CASE 
            WHEN full_name LIKE '% %' THEN split_part(full_name, ' ', 2)
            ELSE ''
        END;
    END IF;

    -- Add phone column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    END IF;

    -- Add is_active column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- Add is_verified column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false;
        UPDATE users SET is_verified = true WHERE email IN ('admin@logisync.com', 'test@logisync.com');
    END IF;

    -- Add last_login column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    END IF;
END $$;

-- ============================================
-- 2. Create roles table
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles with permissions
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Full system access', '["*"]'::jsonb),
('manager', 'Manage operations and team', '["orders.*", "products.*", "customers.*", "warehouses.*", "users.read", "reports.*"]'::jsonb),
('driver', 'Delivery operations', '["orders.read", "orders.update_status", "routes.read", "shipments.update"]'::jsonb),
('customer', 'Customer portal access', '["orders.read", "orders.create", "shipments.track"]'::jsonb),
('vendor', 'Vendor portal access', '["products.read", "orders.read", "inventory.update"]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  permissions = EXCLUDED.permissions;

-- ============================================
-- 3. Create user_roles junction table
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Assign default roles to existing users based on their old role column
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE 
  (u.role = 'admin' AND r.name = 'admin') OR
  (u.role = 'user' AND r.name = 'customer')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- ============================================
-- 4. Create refresh_tokens table
-- ============================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP,
  replaced_by_token TEXT
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================
-- 5. Create password_reset_tokens table
-- ============================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ============================================
-- 6. Create email_verification_tokens table
-- ============================================

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);

-- ============================================
-- 7. Create user_activity_log table
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id INTEGER,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_resource ON user_activity_log(resource_type, resource_id);

-- ============================================
-- 8. Create team_invitations table
-- ============================================

CREATE TABLE IF NOT EXISTS team_invitations (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  invited_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);

-- ============================================
-- 9. Helper Functions
-- ============================================

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id_param INTEGER, permission_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN := false;
    user_permissions JSONB;
    perm TEXT;
BEGIN
    -- Get all permissions for the user from their roles
    SELECT jsonb_agg(DISTINCT elem)
    INTO user_permissions
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    CROSS JOIN jsonb_array_elements_text(r.permissions) elem
    WHERE ur.user_id = user_id_param;

    -- Check if user has wildcard permission
    IF user_permissions ? '*' THEN
        RETURN true;
    END IF;

    -- Check exact permission match
    IF user_permissions ? permission_param THEN
        RETURN true;
    END IF;

    -- Check wildcard patterns (e.g., 'orders.*' matches 'orders.create')
    FOR perm IN SELECT jsonb_array_elements_text(user_permissions)
    LOOP
        IF perm LIKE '%.*' THEN
            IF permission_param LIKE REPLACE(perm, '*', '%') THEN
                RETURN true;
            END IF;
        END IF;
    END LOOP;

    RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- Function to get user roles and permissions
CREATE OR REPLACE FUNCTION get_user_roles(user_id_param INTEGER)
RETURNS TABLE (
    role_name VARCHAR(50),
    role_description TEXT,
    permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT r.name, r.description, r.permissions
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. Comments
-- ============================================

COMMENT ON TABLE roles IS 'System roles with JSONB permission arrays';
COMMENT ON TABLE user_roles IS 'Many-to-many relationship between users and roles';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for token rotation';
COMMENT ON TABLE password_reset_tokens IS 'Temporary tokens for password reset flow';
COMMENT ON TABLE email_verification_tokens IS 'Tokens for email verification';
COMMENT ON TABLE user_activity_log IS 'Audit log of user actions';
COMMENT ON TABLE team_invitations IS 'Team member invitation system';

COMMENT ON COLUMN users.is_active IS 'Whether user account is active';
COMMENT ON COLUMN users.is_verified IS 'Whether email has been verified';
COMMENT ON COLUMN users.last_login IS 'Last successful login timestamp';

COMMENT ON FUNCTION user_has_permission IS 'Check if user has a specific permission (supports wildcards)';
COMMENT ON FUNCTION get_user_roles IS 'Get all roles and permissions for a user';

-- Add index on users.is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
