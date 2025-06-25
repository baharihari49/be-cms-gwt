// src/controllers/user/user.controller.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import prisma from '../../prismaClient';
import bcrypt from 'bcryptjs';

/**
 * Handler: GET /api/users
 * Mengambil semua user dari DB dengan pagination, search, dan filter
 */
export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      search = '', 
      role = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } }
      ];
    }
    
    if (role && role !== 'all') {
      where.role = role;
    }

    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      }
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handler: GET /api/users/:id
 * Mengambil user berdasarkan ID
 */
export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handler: POST /api/users
 * Buat user baru (body: { name, email, password, role? })
 */
export const createUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi sederhana
    if (!name || !email || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'name, email, dan password wajib diisi' 
      });
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false, 
        message: 'Format email tidak valid' 
      });
      return;
    }

    // Validasi password minimum 6 karakter
    if (password.length < 6) {
      res.status(400).json({ 
        success: false, 
        message: 'Password minimal 6 karakter' 
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User berhasil dibuat'
    });
  } catch (error: any) {
    // Tangani khusus error unique constraint (kode Prisma P2002)
    if (error.code === 'P2002') {
      res.status(409).json({ 
        success: false, 
        message: 'Email sudah digunakan' 
      });
      return;
    }
    next(error);
  }
};

/**
 * Handler: PUT /api/users/:id
 * Update user berdasarkan ID
 */
export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};
    
    if (name !== undefined) {
      if (!name.trim()) {
        res.status(400).json({ 
          success: false, 
          message: 'Name tidak boleh kosong' 
        });
        return;
      }
      updateData.name = name;
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ 
          success: false, 
          message: 'Format email tidak valid' 
        });
        return;
      }
      updateData.email = email;
    }

    if (role !== undefined) {
      if (!['USER', 'ADMIN'].includes(role)) {
        res.status(400).json({ 
          success: false, 
          message: 'Role harus USER atau ADMIN' 
        });
        return;
      }
      updateData.role = role;
    }

    if (password !== undefined) {
      if (password.length < 6) {
        res.status(400).json({ 
          success: false, 
          message: 'Password minimal 6 karakter' 
        });
        return;
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'User berhasil diupdate'
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ 
        success: false, 
        message: 'Email sudah digunakan' 
      });
      return;
    }
    next(error);
  }
};

/**
 * Handler: DELETE /api/users/:id
 * Hapus user berdasarkan ID
 */
export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handler: DELETE /api/users/bulk
 * Hapus multiple users berdasarkan array IDs
 */
export const bulkDeleteUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ 
        success: false, 
        message: 'IDs array is required' 
      });
      return;
    }

    // Convert to numbers and validate
    const userIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
    
    if (userIds.length === 0) {
      res.status(400).json({ 
        success: false, 
        message: 'Valid user IDs are required' 
      });
      return;
    }

    // Check how many users exist
    const existingUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true }
    });

    if (existingUsers.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'No users found for deletion' 
      });
      return;
    }

    // Delete users
    const result = await prisma.user.deleteMany({
      where: { id: { in: userIds } }
    });

    res.json({
      success: true,
      message: `${result.count} user(s) berhasil dihapus`,
      deletedCount: result.count
    });
  } catch (error) {
    next(error);
  }
};