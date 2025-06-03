"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hello_controller_1 = require("../controllers/hello.controller");
const router = (0, express_1.Router)();
// GET /api/hello
router.get('/', hello_controller_1.getHello);
exports.default = router;
