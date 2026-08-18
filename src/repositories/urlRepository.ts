import { getDbInstance } from '../db/connection';
import { UrlRecord, CreateUrlDTO } from '../types/url';
import { SqliteError } from 'better-sqlite3';

export class UrlRepository {
  static create(dto: CreateUrlDTO): UrlRecord {
    const db = getDbInstance();
    const stmt = db.prepare(`
      INSERT INTO urls (code, original_url, expires_at)
      VALUES (@code, @original_url, @expires_at)
    `);

    try {
      const info = stmt.run({
        code: dto.code,
        original_url: dto.original_url,
        expires_at: dto.expires_at || null,
      });

      return this.findByCode(dto.code) as UrlRecord;
    } catch (error: any) {
      if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('UNIQUE constraint failed: urls.code');
      }
      throw error;
    }
  }

  static findByCode(code: string): UrlRecord | null {
    const db = getDbInstance();
    const stmt = db.prepare(`
      SELECT * FROM urls WHERE code = ?
    `);
    
    const row = stmt.get(code) as UrlRecord | undefined;
    return row || null;
  }

  static incrementClicks(code: string): UrlRecord | null {
    const db = getDbInstance();
    
    const stmt = db.prepare(`
      UPDATE urls SET clicks = clicks + 1 WHERE code = ?
    `);
    
    const info = stmt.run(code);
    
    if (info.changes === 0) {
      return null;
    }
    
    return this.findByCode(code);
  }

  static isCodeAvailable(code: string): boolean {
    const db = getDbInstance();
    const stmt = db.prepare(`
      SELECT count(*) as count FROM urls WHERE code = ?
    `);
    
    const result = stmt.get(code) as { count: number };
    return result.count === 0;
  }
}
