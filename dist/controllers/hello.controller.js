"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHello = void 0;
const getHello = (req, res) => {
    res.json({ message: 'Halo dari Express + TypeScript!' });
};
exports.getHello = getHello;
