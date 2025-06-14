import express from 'express';
import { faqItemController, faqCategoryController, faqController } from '../../controllers/faq';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// Admin routes for FAQ Items
router.post('/items', verifyToken, isAdmin, faqItemController.create);
router.put('/items/:id', verifyToken, isAdmin, faqItemController.update);
router.delete('/items/:id', verifyToken, isAdmin, faqItemController.delete);

// Admin routes for FAQ Categories
router.post('/categories', verifyToken, isAdmin, faqCategoryController.create);
router.put('/categories/:id', verifyToken, isAdmin, faqCategoryController.update);
router.delete('/categories/:id', verifyToken, isAdmin, faqCategoryController.delete);


export default router;