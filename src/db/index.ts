import { getConnection, closeConnection, getDbInstance } from './connection';
import { applySchema } from './schema';
import Database from 'better-sqlite3';
import { env } from '../config/env';

export const initDatabase = (dbPath: string = env.DB_PATH): Database.Database => {
  const db = getConnection(dbPath);
  applySchema(db);
  return db;
};

export const closeDatabase = (): void => {
  closeConnection();
};

export { getDbInstance };
