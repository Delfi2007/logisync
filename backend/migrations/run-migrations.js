import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { query } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = __dirname;

// Get all migration files in order
const getMigrationFiles = () => {
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql') && file !== 'run-migrations.js')
    .sort();
  return files;
};

// Run a single migration file
const runMigration = async (filename) => {
  const filepath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  console.log(`\n📄 Running migration: ${filename}`);
  
  try {
    await query(sql);
    console.log(`✅ Migration ${filename} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Migration ${filename} failed:`, error.message);
    throw error;
  }
};

// Main migration function
const runMigrations = async () => {
  console.log('🚀 Starting database migrations...\n');
  
  try {
    const files = getMigrationFiles();
    
    if (files.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }
    
    console.log(`Found ${files.length} migration files:\n`);
    files.forEach(file => console.log(`  - ${file}`));
    
    // Run each migration in sequence
    for (const file of files) {
      await runMigration(file);
    }
    
    console.log('\n✅ All migrations completed successfully!');
    console.log('\n📊 Database is ready for use');
    console.log('\n🔑 Default credentials:');
    console.log('   Admin: admin@logisync.com / Admin@123');
    console.log('   User:  test@logisync.com / Test@123');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migrations
runMigrations();
