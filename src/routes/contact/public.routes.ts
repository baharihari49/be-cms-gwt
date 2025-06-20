// routes/contact/public.routes.ts
import express from 'express';
import contactController from '../../controllers/contact/contact.controller';

const router = express.Router();

// Public routes (no authentication required)
router.get('/search', contactController.searchContacts);
router.get('/:id', contactController.getContactById);
router.get('/', contactController.getAllContacts);

export default router;