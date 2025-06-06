// routes/blog/index.ts (Alternative Structure)
import { Router } from 'express';
import publicRoutes from './public.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount public routes
router.use('/', publicRoutes);

// Mount admin routes with /admin prefix
router.use('/admin', adminRoutes);

export default router;

// Usage in main app:
// app.use('/api/blog', blogRoutes);
// 
// This will create:
// Public: /api/blog/posts, /api/blog/categories, etc.
// Admin: /api/blog/admin/posts, /api/blog/admin/categories, etc.