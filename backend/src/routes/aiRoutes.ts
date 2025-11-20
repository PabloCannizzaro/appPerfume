import { Router } from 'express';
import { chatRecommendation, testRecommendation } from '../controllers/aiController';

const router = Router();

router.post('/chat', chatRecommendation);
router.post('/test', testRecommendation);

export default router;
