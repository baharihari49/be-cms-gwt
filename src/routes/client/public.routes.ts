import express from 'express';
import clientController from '../../controllers/client/client.controller';

const router = express.Router();

// public routes
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.get('/search', clientController.searchClients);

export default router;