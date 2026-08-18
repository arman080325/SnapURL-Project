import app from '../src/app';
import { initDatabase } from '../src/db';
import { env } from '../src/config/env';

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await initDatabase(env.DB_PATH);
    initialized = true;
  }
  return app(req, res);
}
