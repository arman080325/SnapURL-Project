import app from './app';
import { initDatabase, closeDatabase } from './db';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || 'data/urls.db';

// Ensure data directory exists if running with a file DB
if (DB_PATH !== ':memory:' && !DB_PATH.startsWith('libsql://') && !DB_PATH.startsWith('http')) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let server: any;

const startServer = async () => {
  try {
    // Initialize database
    await initDatabase(DB_PATH);
    
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database connected at ${DB_PATH}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  if (server) {
    server.close(() => {
      closeDatabase();
      console.log('Server and database closed gracefully');
      process.exit(0);
    });
  } else {
    closeDatabase();
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
