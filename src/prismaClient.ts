// src/prismaClient.ts
import { PrismaClient } from '@prisma/client';

// Buat satu instance PrismaClient untuk di‐reuse di seluruh app
const prisma = new PrismaClient();

export default prisma;
