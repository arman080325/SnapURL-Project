import { initDatabase, closeDatabase } from '../../src/db';
import { UrlRepository } from '../../src/repositories/urlRepository';

describe('UrlRepository', () => {
  beforeAll(() => {
    // Initialize in-memory database for testing
    initDatabase(':memory:');
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    // Optionally clear the urls table before each test if needed
    // But since we use unique codes, we can just use different codes per test
  });

  describe('create', () => {
    it('should create a new URL record', () => {
      const url = UrlRepository.create({
        code: 'test1',
        original_url: 'https://example.com'
      });

      expect(url).toBeDefined();
      expect(url.code).toBe('test1');
      expect(url.original_url).toBe('https://example.com');
      expect(url.clicks).toBe(0);
      expect(url.created_at).toBeDefined();
    });

    it('should throw an error on unique constraint violation', () => {
      UrlRepository.create({
        code: 'duplicate',
        original_url: 'https://example.com'
      });

      expect(() => {
        UrlRepository.create({
          code: 'duplicate',
          original_url: 'https://example.org'
        });
      }).toThrow('UNIQUE constraint failed: urls.code');
    });
  });

  describe('findByCode', () => {
    it('should find an existing URL record by code', () => {
      UrlRepository.create({
        code: 'findme',
        original_url: 'https://find.me'
      });

      const url = UrlRepository.findByCode('findme');
      expect(url).not.toBeNull();
      expect(url?.code).toBe('findme');
    });

    it('should return null for non-existent code', () => {
      const url = UrlRepository.findByCode('notfound');
      expect(url).toBeNull();
    });
  });

  describe('incrementClicks', () => {
    it('should atomically increment clicks and return the updated record', () => {
      UrlRepository.create({
        code: 'clickme',
        original_url: 'https://click.me'
      });

      const updated1 = UrlRepository.incrementClicks('clickme');
      expect(updated1).not.toBeNull();
      expect(updated1?.clicks).toBe(1);

      const updated2 = UrlRepository.incrementClicks('clickme');
      expect(updated2).not.toBeNull();
      expect(updated2?.clicks).toBe(2);
    });

    it('should return null if trying to increment clicks for non-existent code', () => {
      const url = UrlRepository.incrementClicks('nobody');
      expect(url).toBeNull();
    });
  });

  describe('isCodeAvailable', () => {
    it('should return true for an available code', () => {
      expect(UrlRepository.isCodeAvailable('freshcode')).toBe(true);
    });

    it('should return false for an existing code', () => {
      UrlRepository.create({
        code: 'taken',
        original_url: 'https://taken.com'
      });
      expect(UrlRepository.isCodeAvailable('taken')).toBe(false);
    });
  });
});
