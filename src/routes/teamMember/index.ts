// routes/teamMember/index.ts
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
// app.use('/api/team-members', teamMemberRoutes);
// 
// This will create:
// Public: 
//   GET /api/team-members - Get all team members
//   GET /api/team-members/search - Search team members
//   GET /api/team-members/:id - Get team member by ID
//   GET /api/team-members/name/:name - Get team member by name
//   GET /api/team-members/department/:department - Get team members by department
//   GET /api/team-members/meta/departments - Get all departments
//   GET /api/team-members/meta/positions - Get all positions
//   GET /api/team-members/meta/specialities - Get all specialities
// 
// Admin: 
//   POST /api/team-members/admin - Create team member
//   PUT /api/team-members/admin/:id - Update team member
//   DELETE /api/team-members/admin/:id - Delete team member