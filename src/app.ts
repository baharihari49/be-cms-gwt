import express, { Application, Request, Response } from 'express';
import loggerMiddleware from './middlewares/logger.middleware';
import morgan from 'morgan';
import winston from 'winston';
import userRoute from './routes/user.route';
import authRoute from './routes/auth.route';
import projectRoute from './routes/project.route';
import categoryRoute from './routes/category.routes';
import blogRoute from './routes/blog/index';

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

// Middleware bawaan Express untuk parsing JSON body
app.use(express.json());

// Pasang middleware custom
app.use(loggerMiddleware);

// Daftarkan route
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/blogs', blogRoute)

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
