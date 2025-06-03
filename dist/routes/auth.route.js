"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/authRoutes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_controller_1.AuthController.register);
router.post('/login', auth_controller_1.AuthController.login);
// Protected routes
router.get('/me', auth_middleware_1.verifyToken, auth_controller_1.AuthController.getMe);
router.post('/refresh', auth_middleware_1.verifyToken, auth_controller_1.AuthController.refreshToken);
router.post('/logout', auth_middleware_1.verifyToken, auth_controller_1.AuthController.logout);
router.put('/change-password', auth_middleware_1.verifyToken, auth_controller_1.AuthController.changePassword);
exports.default = router;
