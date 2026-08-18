import { UrlService } from '../../src/services/urlService';
import { UrlRepository } from '../../src/repositories/urlRepository';
import { initDatabase, closeDatabase } from '../../src/db';
import { z } from 'zod';

describe('UrlService', () => {
  beforeAll(async () => {
    await initDatabase(':memory:');
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('shortenUrl', () => {
    it('should shorten a valid URL with an auto-generated code', async () => {
      const result = await UrlService.shortenUrl({ original_url: 'https://example.com' });
      expect(result).toBeDefined();
      expect(result.code).toHaveLength(6);
      expect(result.original_url).toBe('https://example.com');
      expect(result.clicks).toBe(0);
    });

    it('should throw ZodError for invalid URL', async () => {
      await expect(UrlService.shortenUrl({ original_url: 'not-a-url' })).rejects.toThrow(z.ZodError);
    });

    it('should use a custom alias if provided and available', async () => {
      const result = await UrlService.shortenUrl({ original_url: 'https://example.com', custom_alias: 'my-custom-alias' });
      expect(result.code).toBe('my-custom-alias');
    });

    it('should throw an error if custom alias is already in use', async () => {
      await UrlService.shortenUrl({ original_url: 'https://example.com', custom_alias: 'taken-alias' });
      await expect(UrlService.shortenUrl({ original_url: 'https://example.org', custom_alias: 'taken-alias' })).rejects.toThrow('Custom alias is already in use');
    });

    it('should retry code generation upon collision', async () => {
      // Mock UrlRepository.isCodeAvailable to fail twice, then succeed
      const originalIsCodeAvailable = UrlRepository.isCodeAvailable;
      let attempt = 0;
      jest.spyOn(UrlRepository, 'isCodeAvailable').mockImplementation(async (code) => {
        attempt++;
        if (attempt <= 2) return false;
        return true;
      });

      const result = await UrlService.shortenUrl({ original_url: 'https://collision.com' });
      expect(result).toBeDefined();
      expect(attempt).toBeGreaterThanOrEqual(3); // 2 fails + 1 success

      // Restore mock
      jest.restoreAllMocks();
    });

    it('should throw an error after max retries for code generation', async () => {
      // Mock UrlRepository.isCodeAvailable to always fail
      jest.spyOn(UrlRepository, 'isCodeAvailable').mockReturnValue(Promise.resolve(false));

      await expect(UrlService.shortenUrl({ original_url: 'https://impossible.com' })).rejects.toThrow('Failed to generate a unique short code after maximum retries');

      // Restore mock
      jest.restoreAllMocks();
    });
  });

  describe('getUrlAnalytics', () => {
    it('should return analytics for an existing code', async () => {
      const record = await UrlService.shortenUrl({ original_url: 'https://analytics.com', custom_alias: 'analytics-test' });
      // Simulate a click
      await UrlRepository.incrementClicks('analytics-test');

      const analytics = await UrlService.getUrlAnalytics('analytics-test');
      expect(analytics).toBeDefined();
      expect(analytics.code).toBe('analytics-test');
      expect(analytics.clicks).toBe(1);
      expect(analytics.created_at).toBeDefined();
    });

    it('should throw an error if URL code is not found', async () => {
      await expect(UrlService.getUrlAnalytics('nonexistent-code')).rejects.toThrow('URL not found');
    });
  });
});
