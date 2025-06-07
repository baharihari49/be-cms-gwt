"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/categoryRoutes.ts
const express_1 = require("express");
const category_controller_1 = require("../controllers/projects/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', category_controller_1.CategoryController.getCategories);
router.get('/:id', category_controller_1.CategoryController.getCategory);
// Protected routes (Admin only)
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, category_controller_1.CategoryController.createCategory);
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, category_controller_1.CategoryController.updateCategory);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, category_controller_1.CategoryController.deleteCategory);
router.post('/recalculate', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, category_controller_1.CategoryController.recalculateCounts);
exports.default = router;
