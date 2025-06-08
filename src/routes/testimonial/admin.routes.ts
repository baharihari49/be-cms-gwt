import express from 'express';
import testimonialController from '../../controllers/client/testimonial.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';


const router = express.Router();


// admin routes
router.post('/', verifyToken, isAdmin, testimonialController.createTestimonial);
router.put('/:id', verifyToken, isAdmin, testimonialController.updateTestimonial);
router.delete('/:id', verifyToken, isAdmin, testimonialController.deleteTestimonial);

export default router;