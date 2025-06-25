// src/routes/user.route.ts
import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById,
  createUser, 
  updateUser, 
  deleteUser,
  bulkDeleteUsers
} from '../controllers/user/user.controller';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Semua routes user memerlukan authentication dan admin privileges
// GET /api/users - Get all users dengan pagination, search, filter
router.get('/', verifyToken, isAdmin, getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', verifyToken, isAdmin, getUserById);

// POST /api/users - Create new user
router.post('/', verifyToken, isAdmin, createUser);

// PUT /api/users/:id - Update user
router.put('/:id', verifyToken, isAdmin, updateUser);

// DELETE /api/users/:id - Delete single user
router.delete('/:id', verifyToken, isAdmin, deleteUser);

// DELETE /api/users/bulk - Delete multiple users
router.delete('/bulk', verifyToken, isAdmin, bulkDeleteUsers);

export default router;