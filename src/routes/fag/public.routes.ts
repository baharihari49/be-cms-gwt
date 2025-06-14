import express from 'express';
import { faqItemController, faqCategoryController, faqController } from '../../controllers/faq';


const router = express.Router();

// Public routes for FAQ Items
router.get('/items', faqItemController.getAll);
router.get('/items/search', faqItemController.search);
router.get('/items/popular', faqItemController.getPopular);
router.get('/items/category/:category', faqItemController.getByCategory);
router.get('/items/:id', faqItemController.getById);


// Public routes for FAQ Categories
router.get('/categories', faqCategoryController.getAll);
router.get('/categories/:id', faqCategoryController.getById);
router.get('/categories/:id/count', faqCategoryController.getItemCount);


// Public routes for FAQ Stats & Grouped Routes
router.get('/stats', faqController.getStats);
router.get('/grouped', faqController.getGroupedByCategory);

export default router;