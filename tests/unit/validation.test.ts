import { normalizeUrl } from '../../src/utils/normalizer';
import { createUrlSchema } from '../../src/utils/validation';

describe('normalizeUrl', () => {
  it('should trim whitespace', () => {
    expect(normalizeUrl('  http://example.com  ')).toBe('http://example.com');
  });

  it('should add http:// if no protocol is present', () => {
    expect(normalizeUrl('example.com')).toBe('http://example.com');
  });

  it('should not modify existing http or https protocols', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    expect(normalizeUrl('http://example.com')).toBe('http://example.com');
  });
});

describe('createUrlSchema', () => {
  it('should validate and normalize a correct URL payload', () => {
    const result = createUrlSchema.safeParse({ original_url: 'example.com' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.original_url).toBe('http://example.com');
    }
  });

  it('should reject invalid URLs', () => {
    const result = createUrlSchema.safeParse({ original_url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('should validate a correct custom alias', () => {
    const result = createUrlSchema.safeParse({ original_url: 'http://example.com', custom_alias: 'my-alias_123' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.custom_alias).toBe('my-alias_123');
    }
  });

  it('should reject a custom alias that is too short', () => {
    const result = createUrlSchema.safeParse({ original_url: 'http://example.com', custom_alias: 'ab' });
    expect(result.success).toBe(false);
  });

  it('should reject a custom alias with invalid characters', () => {
    const result = createUrlSchema.safeParse({ original_url: 'http://example.com', custom_alias: 'my alias!' });
    expect(result.success).toBe(false);
  });

  it('should validate a correct future expires_at date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = createUrlSchema.safeParse({ original_url: 'http://example.com', expires_at: futureDate.toISOString() });
    expect(result.success).toBe(true);
  });

  it('should reject a past expires_at date', () => {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const result = createUrlSchema.safeParse({ original_url: 'http://example.com', expires_at: pastDate.toISOString() });
    expect(result.success).toBe(false);
  });
});
