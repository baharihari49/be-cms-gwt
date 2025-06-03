// src/prismaClient.ts
import { PrismaClient } from './generated/prisma';

// Buat satu instance PrismaClient untuk di‐reuse di seluruh app
const prisma = new PrismaClient();

export default prisma;
