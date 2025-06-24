import { Router } from 'express';
import statisticController from '../../controllers/statistics/statistic.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Admin routes untuk statistics (protected)
router.use([verifyToken, isAdmin]); // Protect all admin routes
router.post('/save', statisticController.saveStatistics);

export default router;
