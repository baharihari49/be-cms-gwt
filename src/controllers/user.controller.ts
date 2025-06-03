// src/controllers/user.controller.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import prisma from '../prismaClient';

/**
 * Handler: GET /api/users
 * Mengambil semua user dari DB
 */
export const getAllUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
    return; // pastikan tidak mengembalikan objek Response
  } catch (error) {
    next(error);
  }
};

/**
 * Handler: POST /api/users
 * Buat user baru (body: { name, email, password, role? })
 * Jika role tidak dikirim, Prisma akan pakai default USER
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
      res.status(400).json({ message: 'name, email, dan password wajib diisi' });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role, // default akan dipakai jika undefined
      },
    });

    res.status(201).json(newUser);
    return;
  } catch (error: any) {
    // Tangani khusus error unique constraint (kode Prisma P2002)
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'Email sudah digunakan' });
      return;
    }
    next(error);
  }
};
