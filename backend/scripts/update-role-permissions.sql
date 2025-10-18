-- Update role permissions to include user management
-- This adds the necessary permissions for Day 3 role management UI

-- Admin already has "*" (all permissions), no update needed

-- Manager: Add user management read permissions (can view users/roles but not modify)
UPDATE roles 
SET permissions = '["orders.*", "products.*", "customers.*", "warehouses.*", "users.read", "roles.read", "activity.read", "reports.*"]'::jsonb
WHERE name = 'manager';

-- Verify permissions
SELECT name, permissions FROM roles ORDER BY name;
