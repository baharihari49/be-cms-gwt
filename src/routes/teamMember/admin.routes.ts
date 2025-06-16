// routes/teamMember/admin.routes.ts
import express from 'express';
import teamMemberController from '../../controllers/team/teamMember.controller';
import { verifyToken, isAdmin } from '../../middlewares/auth.middleware';

const router = express.Router();

// Admin routes - require authentication and admin privileges
// All routes here require verifyToken and isAdmin middleware

// Create team member
router.post('/', verifyToken, isAdmin, teamMemberController.createTeamMember);

// Update team member
router.put('/:id', verifyToken, isAdmin, teamMemberController.updateTeamMember);

// Delete team member
router.delete('/:id', verifyToken, isAdmin, teamMemberController.deleteTeamMember);

export default router;