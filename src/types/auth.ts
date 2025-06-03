// types/auth.ts
import { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}