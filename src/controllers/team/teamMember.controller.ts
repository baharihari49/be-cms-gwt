// controllers/teamMemberController.ts
import { Response } from 'express';
import teamMemberService from '../../services/teamMemberService';
import {
  GetAllTeamMembersRequest,
  GetTeamMemberByIdRequest,
  GetTeamMemberByNameRequest,
  GetTeamMembersByDepartmentRequest,
  CreateTeamMemberRequest,
  UpdateTeamMemberRequest,
  DeleteTeamMemberRequest,
  SearchTeamMemberRequest
} from '../../types/teamMember/requestTypes';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  getTeamMemberByIdSchema,
  getTeamMemberByNameSchema,
  getTeamMembersByDepartmentSchema,
  deleteTeamMemberSchema,
  searchTeamMemberSchema,
  getAllTeamMembersSchema,
  formatZodError
} from '../../schemas/teamMember.schema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class TeamMemberController {
  // GET /api/team-members
  async getAllTeamMembers(req: GetAllTeamMembersRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getAllTeamMembersSchema.parse({ query: req.query });
      const { page, limit, sort, department, position, speciality } = validatedQuery.query;
      
      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name', 'position', 'department', 'experience'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      // Parse filters
      const where: any = {};
      if (department) where.department = { equals: department, mode: 'insensitive' };
      if (position) where.position = { equals: position, mode: 'insensitive' };
      if (speciality) where.speciality = { equals: speciality, mode: 'insensitive' };

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy,
        where: Object.keys(where).length > 0 ? where : undefined
      };

      const teamMembers = await teamMemberService.getAllTeamMembers(options);
      const total = await teamMemberService.getTeamMembersCount({ department, position, speciality });

      sendPaginatedResponse(res, teamMembers, {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      });

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/:id
  async getTeamMemberById(req: GetTeamMemberByIdRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = getTeamMemberByIdSchema.parse({
        params: req.params
      });

      const { id } = validatedData.params;
      const teamMember = await teamMemberService.getTeamMemberById(id);
      sendSuccessResponse(res, teamMember);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/name/:name
  async getTeamMemberByName(req: GetTeamMemberByNameRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = getTeamMemberByNameSchema.parse({
        params: req.params
      });

      const { name } = validatedData.params;
      const teamMember = await teamMemberService.getTeamMemberByName(name);
      sendSuccessResponse(res, teamMember);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/department/:department
  async getTeamMembersByDepartment(req: GetTeamMembersByDepartmentRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and query
      const validatedData = getTeamMembersByDepartmentSchema.parse({
        params: req.params,
        query: req.query
      });

      const { department } = validatedData.params;
      const { page, limit, sort } = validatedData.query;

      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name', 'position', 'department', 'experience'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const teamMembers = await teamMemberService.getTeamMembersByDepartment(department, options);
      const total = await teamMemberService.getTeamMembersCount({ department });

      sendPaginatedResponse(res, teamMembers, {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      });

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/search
  async searchTeamMembers(req: SearchTeamMemberRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = searchTeamMemberSchema.parse({ query: req.query });
      const { q, page, limit, sort, department, position, speciality } = validatedQuery.query;

      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name', 'position', 'department', 'experience'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      // Parse filters
      const where: any = {};
      if (department) where.department = { equals: department, mode: 'insensitive' };
      if (position) where.position = { equals: position, mode: 'insensitive' };
      if (speciality) where.speciality = { equals: speciality, mode: 'insensitive' };

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy,
        where: Object.keys(where).length > 0 ? where : undefined
      };

      const teamMembers = await teamMemberService.searchTeamMembers(q, options);
      const total = await teamMemberService.getSearchCount(q, { department, position, speciality });

      const response = {
        success: true,
        data: teamMembers,
        query: q,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          pages: Math.ceil(total / limitNum)
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // POST /api/team-members
  async createTeamMember(req: CreateTeamMemberRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = createTeamMemberSchema.parse({ body: req.body });
      const teamMemberData = validatedData.body;

      const teamMember = await teamMemberService.createTeamMember(teamMemberData);
      sendCreatedResponse(res, teamMember, 'Team member created successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // PUT /api/team-members/:id
  async updateTeamMember(req: UpdateTeamMemberRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const validatedData = updateTeamMemberSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const teamMember = await teamMemberService.updateTeamMember(id, updateData);
      sendSuccessResponse(res, teamMember, 'Team member updated successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // DELETE /api/team-members/:id
  async deleteTeamMember(req: DeleteTeamMemberRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteTeamMemberSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await teamMemberService.deleteTeamMember(id);
      sendSuccessResponse(res, null, result.message);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/meta/departments
  async getDepartments(req: any, res: Response): Promise<void> {
    try {
      const departments = await teamMemberService.getUniqueDepartments();
      sendSuccessResponse(res, departments, 'Departments retrieved successfully');
    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/meta/positions
  async getPositions(req: any, res: Response): Promise<void> {
    try {
      const positions = await teamMemberService.getUniquePositions();
      sendSuccessResponse(res, positions, 'Positions retrieved successfully');
    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/team-members/meta/specialities
  async getSpecialities(req: any, res: Response): Promise<void> {
    try {
      const specialities = await teamMemberService.getUniqueSpecialities();
      sendSuccessResponse(res, specialities, 'Specialities retrieved successfully');
    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }
}

export default new TeamMemberController();