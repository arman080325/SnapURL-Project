import Database from 'better-sqlite3';

export const applySchema = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      original_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      clicks INTEGER DEFAULT 0
    );
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
  `);
};
