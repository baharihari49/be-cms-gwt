"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.route.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user/user.controller");
const router = (0, express_1.Router)();
// Daftarkan controller ke route masing‐masing
router.get('/', user_controller_1.getAllUsers);
router.post('/', user_controller_1.createUser);
exports.default = router;
