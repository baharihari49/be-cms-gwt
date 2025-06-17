// routes/hero/public.routes.ts
import express from 'express';
import heroController from '../../controllers/hero/hero.controller';

const router = express.Router();

// Public Routes - No authentication required
// GET /api/hero - Get active hero section with optional social media
router.get('/', heroController.getHeroData);

// GET /api/hero/social-media - Get all active social media links
router.get('/social-media', heroController.getAllSocialMedia);

// GET /api/hero/social-media/:id - Get social media by ID
router.get('/social-media/:id', heroController.getSocialMediaById);

export default router;