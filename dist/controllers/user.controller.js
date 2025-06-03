"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
/**
 * Handler: GET /api/users
 * Mengambil semua user dari DB
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await prismaClient_1.default.user.findMany();
        res.json(users);
        return; // pastikan tidak mengembalikan objek Response
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
/**
 * Handler: POST /api/users
 * Buat user baru (body: { name, email, password, role? })
 * Jika role tidak dikirim, Prisma akan pakai default USER
 */
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // Validasi sederhana
        if (!name || !email || !password) {
            res.status(400).json({ message: 'name, email, dan password wajib diisi' });
            return;
        }
        const newUser = await prismaClient_1.default.user.create({
            data: {
                name,
                email,
                password,
                role, // default akan dipakai jika undefined
            },
        });
        res.status(201).json(newUser);
        return;
    }
    catch (error) {
        // Tangani khusus error unique constraint (kode Prisma P2002)
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Email sudah digunakan' });
            return;
        }
        next(error);
    }
};
exports.createUser = createUser;
