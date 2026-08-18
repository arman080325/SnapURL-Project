import crypto from 'crypto';

const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = BASE62_ALPHABET.length;

export function generateShortCode(length: number = 6): string {
  let result = '';
  // Generate a sufficient number of random bytes to get unbiased indices.
  // Each index must be less than 62. Since 256 is not a multiple of 62,
  // we use rejection sampling to avoid bias.
  while (result.length < length) {
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < bytes.length; i++) {
      if (result.length >= length) break;
      // 256 % 62 = 8, so we reject values >= 248 (256 - 8) to avoid modulo bias
      if (bytes[i] < 248) {
        result += BASE62_ALPHABET[bytes[i] % BASE];
      }
    }
  }
  return result;
}
