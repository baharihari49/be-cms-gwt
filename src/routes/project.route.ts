// routes/projectRoutes.ts
import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', ProjectController.getProjects);
router.get('/categories', ProjectController.getCategories);
router.get('/statistics', ProjectController.getStatistics);  
router.get('/:id', ProjectController.getProject);

// Protected routes (Admin only)
router.post('/', verifyToken, isAdmin, ProjectController.createProject);
router.put('/:id', verifyToken, isAdmin, ProjectController.updateProject);
router.delete('/:id', verifyToken, isAdmin, ProjectController.deleteProject);

export default router;