import { Router, Request, Response, NextFunction } from 'express';
import { UrlService } from '../services/urlService';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await UrlService.shortenUrl(req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.get('/:code/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await UrlService.getUrlAnalytics(req.params.code as string);
    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
});

export default router;
