import { getDbInstance } from '../db/connection';
import { UrlRecord, CreateUrlDTO } from '../types/url';

export class UrlRepository {
  static async create(dto: CreateUrlDTO): Promise<UrlRecord> {
    const db = getDbInstance();
    try {
      await db.execute({
        sql: `
          INSERT INTO urls (code, original_url, expires_at)
          VALUES (?, ?, ?)
        `,
        args: [
          dto.code,
          dto.original_url,
          dto.expires_at || null
        ]
      });

      const record = await this.findByCode(dto.code);
      if (!record) {
        throw new Error('Failed to retrieve created record');
      }
      return record;
    } catch (error: any) {
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error('UNIQUE constraint failed: urls.code');
      }
      throw error;
    }
  }

  static async findByCode(code: string): Promise<UrlRecord | null> {
    const db = getDbInstance();
    const result = await db.execute({
      sql: `SELECT * FROM urls WHERE code = ?`,
      args: [code]
    });
    
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as unknown as UrlRecord;
  }

  static async incrementClicks(code: string): Promise<UrlRecord | null> {
    const db = getDbInstance();
    
    const result = await db.execute({
      sql: `UPDATE urls SET clicks = clicks + 1 WHERE code = ?`,
      args: [code]
    });
    
    if (result.rowsAffected === 0) {
      return null;
    }
    
    return this.findByCode(code);
  }

  static async isCodeAvailable(code: string): Promise<boolean> {
    const db = getDbInstance();
    const result = await db.execute({
      sql: `SELECT count(*) as count FROM urls WHERE code = ?`,
      args: [code]
    });
    
    const count = result.rows[0].count as number;
    return count === 0;
  }
}
