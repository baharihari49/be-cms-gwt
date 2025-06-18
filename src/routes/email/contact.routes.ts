// routes/contactRoutes.ts
import { Router } from 'express';
import { sendContactEmail } from '../../controllers/email/contact.controller';

const router = Router();

// Contact form route
router.post('/contact', sendContactEmail);

export default router;