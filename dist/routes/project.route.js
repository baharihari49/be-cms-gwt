"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/projectRoutes.ts
const express_1 = require("express");
// import { ProjectController } from '../controllers/projectController';
// import { verifyToken, isAdmin } from '../middleware/authMiddleware';
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', project_controller_1.ProjectController.getProjects);
router.get('/categories', project_controller_1.ProjectController.getCategories);
router.get('/statistics', project_controller_1.ProjectController.getStatistics);
router.get('/:id', project_controller_1.ProjectController.getProject);
// Protected routes (Admin only)
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, project_controller_1.ProjectController.createProject);
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, project_controller_1.ProjectController.updateProject);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, project_controller_1.ProjectController.deleteProject);
exports.default = router;
