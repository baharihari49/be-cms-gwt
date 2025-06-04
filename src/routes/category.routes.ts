// routes/categoryRoutes.ts
import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, CategoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, CategoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, CategoryController.deleteCategory);
router.post('/recalculate', verifyToken, isAdmin, CategoryController.recalculateCounts);

export default router;