import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';

let dbInstance: Client | null = null;

export const getConnection = (dbPath: string): Client => {
  if (dbInstance) {
    return dbInstance;
  }

  // Handle local SQLite file setup
  if (dbPath !== ':memory:' && !dbPath.startsWith('libsql://') && !dbPath.startsWith('http')) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const url = dbPath.startsWith('libsql://') || dbPath.startsWith('http') || dbPath === ':memory:' 
    ? dbPath 
    : `file:${dbPath}`;

  dbInstance = createClient({
    url: url,
    // Add authToken here if needed from environment variables for Turso Cloud
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return dbInstance;
};

export const closeConnection = (): void => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};

export const getDbInstance = (): Client => {
  if (!dbInstance) {
    throw new Error('Database connection not initialized. Call initDatabase first.');
  }
  return dbInstance;
};
