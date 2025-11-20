import { Router } from 'express';
import { getUserPreferences, updateUserPreference } from '../controllers/userController';

const router = Router();

router.get('/:userId/preferences', getUserPreferences);
router.post('/:userId/preferences', updateUserPreference);

export default router;
