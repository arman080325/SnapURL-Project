import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  if (err.message === 'Custom alias is already in use' || err.message === 'Failed to generate a unique short code after maximum retries') {
    return res.status(409).json({ error: err.message });
  }

  if (err.message === 'URL not found') {
    return res.status(404).json({ error: err.message });
  }

  console.error('[Error]', err);
  return res.status(500).json({ error: 'Internal Server Error' });
}
