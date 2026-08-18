import { generateShortCode } from '../../src/utils/generator';

describe('generateShortCode', () => {
  it('should generate a string of the default length 6', () => {
    const code = generateShortCode();
    expect(code).toHaveLength(6);
  });

  it('should generate a string of the specified length', () => {
    const code = generateShortCode(10);
    expect(code).toHaveLength(10);
  });

  it('should only contain base62 characters (alphanumeric)', () => {
    const code = generateShortCode(100);
    expect(code).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it('should generate unique codes across multiple calls', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateShortCode());
    }
    // Very unlikely to have collisions in 1000 codes of length 6
    expect(codes.size).toBe(1000);
  });
});
