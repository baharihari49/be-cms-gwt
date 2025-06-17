// routes/hero/admin.routes.ts
import express from 'express';
import heroController from '../../controllers/hero/hero.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// Admin Routes - Require authentication and admin role
// Hero Section Management
router.get('/sections', verifyToken, isAdmin, heroController.getAllHeroSections);
router.get('/sections/:id', verifyToken, isAdmin, heroController.getHeroSectionById);
router.post('/sections', verifyToken, isAdmin, heroController.createHeroSection);
router.put('/sections/:id', verifyToken, isAdmin, heroController.updateHeroSection);
router.delete('/sections/:id', verifyToken, isAdmin, heroController.deleteHeroSection);

// Social Media Management
router.post('/social-media', verifyToken, isAdmin, heroController.createSocialMedia);
router.put('/social-media/:id', verifyToken, isAdmin, heroController.updateSocialMedia);
router.delete('/social-media/:id', verifyToken, isAdmin, heroController.deleteSocialMedia);

export default router;