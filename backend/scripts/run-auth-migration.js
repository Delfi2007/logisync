import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD.replace(/'/g, '')
});

async function runMigration() {
  try {
    console.log('🚀 Running authentication system migration...\n');
    
    const migrationFile = path.join(__dirname, '..', 'database', 'migrations', '007_enhance_authentication.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Authentication migration completed successfully!\n');
    
    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('roles', 'user_roles', 'refresh_tokens', 'password_reset_tokens', 'email_verification_tokens', 'user_activity_log', 'team_invitations')
      ORDER BY table_name;
    `);
    
    console.log('📊 New authentication tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Check roles
    const rolesResult = await pool.query('SELECT name, description FROM roles ORDER BY name;');
    console.log('\n🔐 Default roles created:');
    rolesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.name.padEnd(12)} - ${row.description}`);
    });
    
    console.log('\n✨ Database is ready for JWT authentication!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
