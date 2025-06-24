import { Router } from 'express';
import statisticController from '../../controllers/statistics/statistic.controller';

const router = Router();

// Public routes untuk statistics
router.get('/', statisticController.getStatistics);// Public routes untuk statistics
router.get('/debug', statisticController.debugStatistics);

export default router;