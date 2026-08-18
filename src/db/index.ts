import { getConnection, closeConnection, getDbInstance } from './connection';
import { applySchema } from './schema';
import { Client } from '@libsql/client';
import { env } from '../config/env';

export const initDatabase = async (dbPath: string = env.DB_PATH): Promise<Client> => {
  const db = getConnection(dbPath);
  await applySchema(db);
  return db;
};

export const closeDatabase = (): void => {
  closeConnection();
};

export { getDbInstance };
