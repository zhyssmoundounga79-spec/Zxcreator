import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('creatorforge.db');
export const db = new Database(dbPath);

export function initDb() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      tiktok_handle TEXT UNIQUE,
      role TEXT DEFAULT 'user', -- 'user' or 'admin'
      plan TEXT DEFAULT 'free', -- 'free', 'pro', 'elite'
      balance REAL DEFAULT 0.0,
      referral_code TEXT UNIQUE,
      referred_by INTEGER REFERENCES users(id),
      last_daily_bonus TEXT,
      last_ad_view INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations (for existing databases)
  const columns = [
    { name: 'tiktok_handle', type: 'TEXT UNIQUE' },
    { name: 'balance', type: 'REAL DEFAULT 0.0' }, // Credits for AI generation
    { name: 'affiliate_earnings', type: 'REAL DEFAULT 0.0' }, // Cash earnings (€)
    { name: 'last_ad_view', type: 'INTEGER DEFAULT 0' },
    { name: 'referral_code', type: 'TEXT UNIQUE' },
    { name: 'referred_by', type: 'INTEGER REFERENCES users(id)' },
    { name: 'last_daily_bonus', type: 'TEXT' }
  ];

  columns.forEach(col => {
    try {
      db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
    } catch (e: any) {
      // Ignore error if column already exists
      if (!e.message.includes('duplicate column name')) {
        console.log(`Migration note: Could not add column ${col.name}: ${e.message}`);
      }
    }
  });

  // Affiliate Submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS affiliate_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      platform TEXT NOT NULL, -- 'TikTok', 'Instagram', 'YouTube'
      video_url TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      views_count INTEGER DEFAULT 0,
      earnings REAL DEFAULT 0.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Content generations table (history)
  db.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT NOT NULL, -- 'idea', 'script', 'hook', 'thumbnail'
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Subscriptions table (mock)
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      status TEXT,
      current_period_end DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // System Earnings table (Z Space)
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_earnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL DEFAULT 0.0,
      source TEXT, -- 'referral_split', 'subscription_fee', etc.
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Payout Requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payout_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL, -- 'paypal', 'bank', 'crypto'
      details TEXT NOT NULL, -- email, IBAN, wallet address
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Seed Admin User if not exists
  const adminExists = db.prepare("SELECT * FROM users WHERE email = 'admin@creatorforge.com'").get();
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const adminReferralCode = 'ADMIN123'; // Fixed code for admin
    db.prepare(`
      INSERT INTO users (email, password, name, role, plan, referral_code)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('admin@creatorforge.com', hashedPassword, 'Admin User', 'admin', 'elite', adminReferralCode);
    console.log('Admin user seeded: admin@creatorforge.com / admin123');
  }
}
