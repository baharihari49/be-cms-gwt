import { Router } from 'express';
import { getHello } from '../controllers/hello.controller';

const router = Router();

// GET /api/hello
router.get('/', getHello);

export default router;
