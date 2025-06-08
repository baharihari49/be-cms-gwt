// routes/services.routes.ts
import express from 'express';
import serviceController from '../../controllers/services/service.controller';

const router = express.Router();

// public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/search', serviceController.searchServices);

export default router;