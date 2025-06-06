// src/routes/user.route.ts
import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/user.controller';

const router = Router();

// Daftarkan controller ke route masing‐masing
router.get('/', getAllUsers);
router.post('/', createUser);

export default router;
