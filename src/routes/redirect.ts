import { Router, Request, Response, NextFunction } from 'express';
import { UrlRepository } from '../repositories/urlRepository';

const router = Router();

router.get('/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.params.code as string;
    const record = await UrlRepository.findByCode(code);
    
    if (!record) {
      res.status(404).send('URL not found');
      return;
    }

    await UrlRepository.incrementClicks(code);
    res.redirect(302, record.original_url);
  } catch (error) {
    next(error);
  }
});

export default router;
