import express, { Application, Request, Response } from 'express';
import cors from 'cors';                         // ← tambahkan ini
import loggerMiddleware from './middlewares/logger.middleware';
import morgan from 'morgan';
import winston from 'winston';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';
import projectRoute from './routes/project.route';
import categoryRoute from './routes/category.routes';
import blogRoute from './routes/blog/index';
import technologyRoute from './routes/technology/index';
import servicesRoute from './routes/services/index';
import clientRoute from './routes/client/index';
import testimonialRoute from './routes/testimonial/index';
import faqsRoute from './routes/fag/index'
import aboutUsRoute from './routes/about/index'
import teamsRoute from './routes/teamMember/index'
import heroRoute from './routes/hero/index'
import emailRoute from './routes/email/contact.routes'
import deleteImageClodinary from './routes/cloudinary.routes'

const app: Application = express();

// Buat logger Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log', level: 'info' })
  ]
});

// Pasang morgan, tapi output diarahkan ke Winston
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  })
);

// Konfigurasi CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://fe-gwt.baharihari.com/',
  'https://fe-gwt.baharihari.com',
  'https://cms.gwt.co.id',
  'https://gwt.baharihari.com',
  'https://gwt.co.id',
  // tambahkan origin lain sesuai kebutuhan
];

app.use(
  cors({
    origin: (origin, callback) => {
      // jika request bersumber dari origin yang terdaftar, allow,
      // atau jika tidak ada origin (misal dari Postman), juga allow
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,        // jika perlu mengizinkan cookie/auth headers
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Middleware bawaan Express untuk parsing JSON body
app.use(express.json());

// Pasang middleware custom
app.use(loggerMiddleware);

// Daftarkan route
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/technologies', technologyRoute);
app.use('/api/services', servicesRoute);
app.use('/api/clients', clientRoute);
app.use('/api/testimonials', testimonialRoute);
app.use('/api/faqs', faqsRoute);
app.use('/api/about-us', aboutUsRoute)
app.use('/api/team-members', teamsRoute)
app.use('/api/hero', heroRoute)
app.use('/api/email', emailRoute)
app.use('/api/cloudinary', deleteImageClodinary)

// Endpoint utama (root) dengan pesan sambutan dan link dokumentasi
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the GWT CMS Backend API. Visit /api/* endpoints to access resources.',
    documentation: 'https://xus367y7ar.apidog.io/'
  });
});

// Route fallback jika tidak ditemukan
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

export default app;
