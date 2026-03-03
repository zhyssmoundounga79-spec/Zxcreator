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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrations
  try {
    db.exec("ALTER TABLE users ADD COLUMN tiktok_handle TEXT UNIQUE");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE users ADD COLUMN balance REAL DEFAULT 0.0");
  } catch (e) {}

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

  // Seed Admin User if not exists
  const adminExists = db.prepare("SELECT * FROM users WHERE email = 'admin@creatorforge.com'").get();
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (email, password, name, role, plan)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin@creatorforge.com', hashedPassword, 'Admin User', 'admin', 'elite');
    console.log('Admin user seeded: admin@creatorforge.com / admin123');
  }
}
