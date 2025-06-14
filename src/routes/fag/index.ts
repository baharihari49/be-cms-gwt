import Router from 'express';
import publicRoutes from './public.routes'
import adminRoutes from './admin.routes';


const router = Router();


// Mount public routes
router.use('/', publicRoutes);

// Mount admin routes with /admin prefix
router.use('/admin', adminRoutes);

export default router;