import express from 'express';
import testimonialController from '../../controllers/client/testimonial.controller';


const router = express.Router();

// Public routes
router.get('/', testimonialController.getAllTestimonials);
router.get('/:id', testimonialController.getTestimonialById);
router.get('/search', testimonialController.searchTestimonials);

export default router;