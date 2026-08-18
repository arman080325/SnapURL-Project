import { Client } from '@libsql/client';

export const applySchema = async (db: Client): Promise<void> => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      original_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      clicks INTEGER DEFAULT 0
    );
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
  `);
};
