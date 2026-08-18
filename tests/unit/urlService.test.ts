import { UrlService } from '../../src/services/urlService';
import { UrlRepository } from '../../src/repositories/urlRepository';
import { initDatabase, closeDatabase } from '../../src/db';
import { z } from 'zod';

describe('UrlService', () => {
  beforeAll(() => {
    initDatabase(':memory:');
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('shortenUrl', () => {
    it('should shorten a valid URL with an auto-generated code', () => {
      const result = UrlService.shortenUrl({ original_url: 'https://example.com' });
      expect(result).toBeDefined();
      expect(result.code).toHaveLength(6);
      expect(result.original_url).toBe('https://example.com');
      expect(result.clicks).toBe(0);
    });

    it('should throw ZodError for invalid URL', () => {
      expect(() => {
        UrlService.shortenUrl({ original_url: 'not-a-url' });
      }).toThrow(z.ZodError);
    });

    it('should use a custom alias if provided and available', () => {
      const result = UrlService.shortenUrl({ original_url: 'https://example.com', custom_alias: 'my-custom-alias' });
      expect(result.code).toBe('my-custom-alias');
    });

    it('should throw an error if custom alias is already in use', () => {
      UrlService.shortenUrl({ original_url: 'https://example.com', custom_alias: 'taken-alias' });
      expect(() => {
        UrlService.shortenUrl({ original_url: 'https://example.org', custom_alias: 'taken-alias' });
      }).toThrow('Custom alias is already in use');
    });

    it('should retry code generation upon collision', () => {
      // Mock UrlRepository.isCodeAvailable to fail twice, then succeed
      const originalIsCodeAvailable = UrlRepository.isCodeAvailable;
      let attempt = 0;
      jest.spyOn(UrlRepository, 'isCodeAvailable').mockImplementation((code) => {
        attempt++;
        if (attempt <= 2) return false;
        return true;
      });

      const result = UrlService.shortenUrl({ original_url: 'https://collision.com' });
      expect(result).toBeDefined();
      expect(attempt).toBeGreaterThanOrEqual(3); // 2 fails + 1 success

      // Restore mock
      jest.restoreAllMocks();
    });

    it('should throw an error after max retries for code generation', () => {
      // Mock UrlRepository.isCodeAvailable to always fail
      jest.spyOn(UrlRepository, 'isCodeAvailable').mockReturnValue(false);

      expect(() => {
        UrlService.shortenUrl({ original_url: 'https://impossible.com' });
      }).toThrow('Failed to generate a unique short code after maximum retries');

      // Restore mock
      jest.restoreAllMocks();
    });
  });

  describe('getUrlAnalytics', () => {
    it('should return analytics for an existing code', () => {
      const record = UrlService.shortenUrl({ original_url: 'https://analytics.com', custom_alias: 'analytics-test' });
      // Simulate a click
      UrlRepository.incrementClicks('analytics-test');

      const analytics = UrlService.getUrlAnalytics('analytics-test');
      expect(analytics).toBeDefined();
      expect(analytics.code).toBe('analytics-test');
      expect(analytics.clicks).toBe(1);
      expect(analytics.created_at).toBeDefined();
    });

    it('should throw an error if URL code is not found', () => {
      expect(() => {
        UrlService.getUrlAnalytics('nonexistent-code');
      }).toThrow('URL not found');
    });
  });
});
