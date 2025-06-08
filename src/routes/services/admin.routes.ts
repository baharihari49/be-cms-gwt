// routes/services.routes.ts
import express from 'express';
import serviceController from '../../controllers/services/service.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// Admin routes
router.post('/', verifyToken, isAdmin, serviceController.createService);
router.put('/:id', verifyToken, isAdmin, serviceController.updateService);
router.delete('/:id', verifyToken, isAdmin, serviceController.deleteService);

export default router;