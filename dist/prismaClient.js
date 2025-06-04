"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/prismaClient.ts
const client_1 = require("@prisma/client");
// Buat satu instance PrismaClient untuk di‐reuse di seluruh app
const prisma = new client_1.PrismaClient();
exports.default = prisma;
