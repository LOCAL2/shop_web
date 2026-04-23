import { createClient } from '@libsql/client'
import * as dotenv from 'fs'

// Read .env.local manually
const envContent = dotenv.readFileSync('.env.local', 'utf-8')
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
})

async function run() {
  console.log('Running migrations...')
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      store_name TEXT NOT NULL DEFAULT 'My Shop',
      tagline TEXT NOT NULL DEFAULT '',
      logo_text TEXT NOT NULL DEFAULT 'MY SHOP',
      primary_color TEXT NOT NULL DEFAULT '#6366f1',
      accent_color TEXT NOT NULL DEFAULT '#f59e0b',
      hero_title TEXT NOT NULL DEFAULT 'ยินดีต้อนรับสู่ร้านของเรา',
      hero_subtitle TEXT NOT NULL DEFAULT 'เลือกซื้อสินค้าคุณภาพดีในราคาที่คุณพอใจ',
      hero_image TEXT NOT NULL DEFAULT '',
      currency TEXT NOT NULL DEFAULT 'THB',
      currency_symbol TEXT NOT NULL DEFAULT '฿',
      show_hero INTEGER NOT NULL DEFAULT 1,
      footer_text TEXT NOT NULL DEFAULT '© 2025 My Shop. All rights reserved.',
      social_facebook TEXT NOT NULL DEFAULT '',
      social_instagram TEXT NOT NULL DEFAULT '',
      social_line TEXT NOT NULL DEFAULT ''
    );
    INSERT OR IGNORE INTO settings (id) VALUES (1);
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      image TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      in_stock INTEGER NOT NULL DEFAULT 1,
      account_type TEXT NOT NULL DEFAULT 'private',
      max_users INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin INTEGER NOT NULL DEFAULT 0,
      admin_pin TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS topups (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      amount REAL NOT NULL,
      slip_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS app_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT NOT NULL DEFAULT '',
      banner TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      subtitle TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      link_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      max_users INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_account_usage (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      account_id TEXT NOT NULL REFERENCES accounts(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      account_id TEXT REFERENCES accounts(id),
      price REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  // Add columns to existing tables if they don't exist yet
  const alterStatements = [
    `ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN admin_pin TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN points INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE settings ADD COLUMN app_name TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE settings ADD COLUMN app_logo TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE products ADD COLUMN account_type TEXT NOT NULL DEFAULT 'private'`,
    `ALTER TABLE products ADD COLUMN max_users INTEGER NOT NULL DEFAULT 1`,
  ]
  for (const sql of alterStatements) {
    try {
      await db.execute(sql)
      console.log('Applied:', sql)
    } catch {
      // Column already exists — skip
    }
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
