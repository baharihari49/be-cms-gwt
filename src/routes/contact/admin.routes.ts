// routes/contact/admin.routes.ts
import express from 'express';
import contactController from '../../controllers/contact/contact.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// Admin routes (protected)
router.post('/', verifyToken, isAdmin, contactController.createContact);
router.put('/:id', verifyToken, isAdmin, contactController.updateContact);
router.delete('/:id', verifyToken, isAdmin, contactController.deleteContact);

export default router;