import { Router } from 'express';
import { addPerfumeReview, getPerfumeDetail, getPerfumeReviews, listPerfumes } from '../controllers/perfumeController';

const router = Router();

router.get('/', listPerfumes);
router.get('/:id', getPerfumeDetail);
router.get('/:id/reviews', getPerfumeReviews);
router.post('/:id/reviews', addPerfumeReview);

export default router;
