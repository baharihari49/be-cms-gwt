// routes/technologyRoutes.ts
import express from 'express';
import technologyController from '../../controllers/Technology/tecnology.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// admin routes
router.post('/', verifyToken, isAdmin, technologyController.createTechnology);
router.put('/:id', verifyToken, isAdmin, technologyController.updateTechnology);
router.delete('/:id', verifyToken, isAdmin, technologyController.deleteTechnology);

export default router;