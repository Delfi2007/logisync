/**
 * Create Demo User Script
 * Creates a demo user account with credentials: demo@logisync.com / password123
 */

import { query } from '../src/config/database.js';
import { hashPassword } from '../src/utils/password.js';

async function createDemoUser() {
  try {
    console.log('🔄 Creating demo user account...');
    
    const email = 'demo@logisync.com';
    const password = 'password123';
    const fullName = 'Demo User';
    const role = 'admin';
    
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  Demo user already exists. Deleting and recreating...');
      await query('DELETE FROM users WHERE email = $1', [email]);
    }
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, full_name, role`,
      [email, passwordHash, fullName, role]
    );
    
    const user = result.rows[0];
    
    console.log('✅ Demo user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: password123');
    console.log('👤 Name:', user.full_name);
    console.log('🎭 Role:', user.role);
    console.log('\n🎉 You can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
    process.exit(1);
  }
}

// Run the script
createDemoUser();
