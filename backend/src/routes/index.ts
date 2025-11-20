// Central router to mount feature routes.
import { Router } from 'express';
import perfumeRoutes from './perfumeRoutes';
import userRoutes from './userRoutes';
import aiRoutes from './aiRoutes';

const router = Router();

router.use('/perfumes', perfumeRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);

export default router;
