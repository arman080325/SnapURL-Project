import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let dbInstance: Database.Database | null = null;

export const getConnection = (dbPath: string): Database.Database => {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure data directory exists if not using memory database
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  dbInstance = new Database(dbPath);

  // Configure PRAGMAs
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');
  dbInstance.pragma('synchronous = NORMAL');

  return dbInstance;
};

export const closeConnection = (): void => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

export const getDbInstance = (): Database.Database => {
  if (!dbInstance) {
    throw new Error('Database connection not initialized. Call initDatabase first.');
  }
  return dbInstance;
};
