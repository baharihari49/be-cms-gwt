// routes/technologyRoutes.ts
import express from 'express';
import technologyController from '../../controllers/Technology/tecnology.controller'

const router = express.Router();

// Routes without middleware validation (validation done in controller)
router.get('/search', technologyController.searchTechnologies);
router.get('/name/:name', technologyController.getTechnologyByName);
router.get('/:id', technologyController.getTechnologyById);
router.get('/', technologyController.getAllTechnologies);

export default router;