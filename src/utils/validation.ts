import { z } from 'zod';
import { normalizeUrl } from './normalizer';

export const createUrlSchema = z.object({
  original_url: z.string().trim().min(1, 'URL is required').transform(normalizeUrl).pipe(z.string().url('Invalid URL format').refine(url => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.includes('.') || hostname === 'localhost';
    } catch {
      return false;
    }
  }, 'Invalid URL hostname')),
  custom_alias: z.string()
    .trim()
    .min(3, 'Custom alias must be at least 3 characters')
    .max(30, 'Custom alias must be at most 30 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Custom alias can only contain alphanumeric characters, dashes, and underscores')
    .optional(),
  expires_at: z.string().datetime().refine(val => new Date(val) > new Date(), {
    message: 'expires_at must be a future date'
  }).optional()
});
