import { UrlRepository } from '../repositories/urlRepository';
import { createUrlSchema } from '../utils/validation';
import { generateShortCode } from '../utils/generator';
import { UrlRecord, UrlAnalyticsDTO } from '../types/url';
import { z } from 'zod';

export class UrlService {
  /**
   * Shortens a URL using either a custom alias or auto-generated code.
   * Handles validation and collision retries.
   */
  static shortenUrl(payload: unknown): UrlRecord {
    // 1. Validate and normalize payload
    const parsed = createUrlSchema.safeParse(payload);
    if (!parsed.success) {
      throw parsed.error;
    }
    
    const { original_url, custom_alias, expires_at } = parsed.data;

    // 2. Handle Custom Alias
    if (custom_alias) {
      if (!UrlRepository.isCodeAvailable(custom_alias)) {
        throw new Error('Custom alias is already in use');
      }
      return UrlRepository.create({
        code: custom_alias,
        original_url,
        expires_at
      });
    }

    // 3. Handle Auto-generated Short Code with collision retry loop
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      const code = generateShortCode(6);
      if (UrlRepository.isCodeAvailable(code)) {
        return UrlRepository.create({
          code,
          original_url,
          expires_at
        });
      }
    }

    throw new Error('Failed to generate a unique short code after maximum retries');
  }

  /**
   * Retrieves analytics for a specific short code.
   */
  static getUrlAnalytics(code: string): UrlAnalyticsDTO {
    const record = UrlRepository.findByCode(code);
    if (!record) {
      throw new Error('URL not found');
    }

    return {
      code: record.code,
      clicks: record.clicks,
      created_at: record.created_at,
      last_accessed: undefined // We can track this later via a separate table or column if needed, for v1 it's optional
    };
  }
}
