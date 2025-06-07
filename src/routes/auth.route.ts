// routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', verifyToken, AuthController.getMe);
router.post('/refresh', verifyToken, AuthController.refreshToken);
router.post('/logout', verifyToken, AuthController.logout);
router.put('/change-password', verifyToken, AuthController.changePassword);

export default router;