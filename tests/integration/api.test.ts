import request from 'supertest';
import app from '../../src/app';
import { UrlRepository } from '../../src/repositories/urlRepository';
import { initDatabase, closeDatabase } from '../../src/db';

beforeAll(() => {
  initDatabase(':memory:');
});

afterAll(() => {
  closeDatabase();
});

describe('Phase 3 API Integration Tests', () => {
  let createdCode: string;

  describe('POST /api/urls', () => {
    it('should create a short URL', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({ original_url: 'https://example.com' })
        .expect(201);

      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('original_url', 'https://example.com');
      createdCode = response.body.code;
    });

    it('should return 400 for invalid URL', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({ original_url: 'not-a-url' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation Error');
    });

    it('should return 409 for duplicate custom alias', async () => {
      await request(app)
        .post('/api/urls')
        .send({ original_url: 'https://example2.com', custom_alias: 'custom123' })
        .expect(201);

      const response = await request(app)
        .post('/api/urls')
        .send({ original_url: 'https://example3.com', custom_alias: 'custom123' })
        .expect(409);

      expect(response.body).toHaveProperty('error', 'Custom alias is already in use');
    });
  });

  describe('GET /:code', () => {
    it('should redirect 302 for existing code', async () => {
      await request(app)
        .get(`/${createdCode}`)
        .expect(302)
        .expect('Location', 'https://example.com');
    });

    it('should return 404 for non-existent code', async () => {
      const response = await request(app)
        .get('/nonexistent123')
        .expect(404);

      expect(response.text).toBe('URL not found');
    });
  });

  describe('GET /api/urls/:code/analytics', () => {
    it('should return analytics for existing code', async () => {
      const response = await request(app)
        .get(`/api/urls/${createdCode}/analytics`)
        .expect(200);

      expect(response.body).toHaveProperty('code', createdCode);
      expect(response.body.clicks).toBeGreaterThanOrEqual(1);
    });

    it('should return 404 for non-existent code analytics', async () => {
      await request(app)
        .get('/api/urls/nonexistent123/analytics')
        .expect(404);
    });
  });

  describe('Global 404 Handler', () => {
    it('should return JSON 404 for unmapped route', async () => {
      const response = await request(app)
        .get('/api/some/unknown/route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
