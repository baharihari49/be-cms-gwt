// routes/teamMember/public.routes.ts
import express from 'express';
import teamMemberController from '../../controllers/team/teamMember.controller';

const router = express.Router();

// Public routes - no authentication required
// GET routes should be placed in specific to general order to avoid conflicts

// Search team members - must be before /:id to avoid conflicts
router.get('/search', teamMemberController.searchTeamMembers);

// Get metadata
router.get('/meta/departments', teamMemberController.getDepartments);
router.get('/meta/positions', teamMemberController.getPositions);
router.get('/meta/specialities', teamMemberController.getSpecialities);

// Get team members by department
router.get('/department/:department', teamMemberController.getTeamMembersByDepartment);

// Get team member by name
router.get('/name/:name', teamMemberController.getTeamMemberByName);

// Get team member by ID
router.get('/:id', teamMemberController.getTeamMemberById);

// Get all team members
router.get('/', teamMemberController.getAllTeamMembers);

export default router;