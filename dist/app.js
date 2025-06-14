"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // ← tambahkan ini
const logger_middleware_1 = __importDefault(require("./middlewares/logger.middleware"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const index_1 = __importDefault(require("./routes/blog/index"));
const index_2 = __importDefault(require("./routes/technology/index"));
const index_3 = __importDefault(require("./routes/services/index"));
const index_4 = __importDefault(require("./routes/client/index"));
const index_5 = __importDefault(require("./routes/testimonial/index"));
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
// Konfigurasi CORS
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://fe-gwt.baharihari.com/',
    'https://fe-gwt.baharihari.com',
    'https://cms.gwt.co.id',
    'https://gwt.baharihari.com',
    'https://gwt.co.id'
    // tambahkan origin lain sesuai kebutuhan
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // jika request bersumber dari origin yang terdaftar, allow,
        // atau jika tidak ada origin (misal dari Postman), juga allow
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // jika perlu mengizinkan cookie/auth headers
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware bawaan Express untuk parsing JSON body
app.use(express_1.default.json());
// Pasang middleware custom
app.use(logger_middleware_1.default);
// Daftarkan route
app.use('/api/users', user_route_1.default);
app.use('/api/auth', auth_route_1.default);
app.use('/api/projects', project_route_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/blogs', index_1.default);
app.use('/api/technologies', index_2.default);
app.use('/api/services', index_3.default);
app.use('/api/clients', index_4.default);
app.use('/api/testimonials', index_5.default);
// Endpoint utama (root) dengan pesan sambutan dan link dokumentasi
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the GWT CMS Backend API. Visit /api/* endpoints to access resources.',
        documentation: 'https://xus367y7ar.apidog.io/'
    });
});
// Route fallback jika tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});
exports.default = app;
