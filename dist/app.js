"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hello_route_1 = __importDefault(require("./routes/hello.route"));
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const app = (0, express_1.default)();
// Buat logger Winston
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'app.log', level: 'info' })
    ]
});
// Pasang morgan, tapi output diarahkan ke Winston
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));
// Middleware bawaan Express untuk parsing JSON body
app.use(express_1.default.json());
// Pasang middleware custom (contohnya logger sederhana)
app.use(logger_middleware_1.default);
// Daftarkan route
app.use('/api/hello', hello_route_1.default);
app.use('/api/users', user_route_1.default);
app.use('/api/auth', auth_route_1.default);
app.use('/api/projects', project_route_1.default);
app.use('/api/categories', category_routes_1.default);
// Route fallback jika tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});
exports.default = app;
