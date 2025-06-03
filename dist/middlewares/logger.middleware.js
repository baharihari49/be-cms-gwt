"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
};
exports.default = loggerMiddleware;
