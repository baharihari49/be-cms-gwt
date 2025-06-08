import express from 'express';
import clientController from '../../controllers/client/client.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// admin routes
router.post('/', verifyToken, isAdmin, clientController.createClient);
router.put('/:id', verifyToken, isAdmin, clientController.updateClient);
router.delete('/:id', verifyToken, isAdmin, clientController.deleteClient);

export default router;