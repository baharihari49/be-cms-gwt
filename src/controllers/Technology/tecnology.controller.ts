// controllers/technologyController.ts
import { Response } from 'express';
import technologyService from '../../services/tecnologyServices';
import {
  TechnologyRequest,
  GetTechnologyByIdRequest,
  GetTechnologyByNameRequest,
  CreateTechnologyRequest,
  UpdateTechnologyRequest,
  DeleteTechnologyRequest,
  SearchTechnologyRequest,
  GetAllTechnologiesRequest
} from '../../types/technology/requestTypes';
import {
  TechnologyResponse,
  TechnologiesResponse,
  TechnologySearchResponse,
  IncludeOptions,
  ErrorResponse
} from '../../types/technology/technologyTypes';
import {
  createTechnologySchema,
  updateTechnologySchema,
  getTechnologyByIdSchema,
  getTechnologyByNameSchema,
  deleteTechnologySchema,
  searchTechnologySchema,
  getAllTechnologiesSchema,
  formatZodError
} from '../../schemas/technologySchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class TechnologyController {
  // GET /api/technologies
  async getAllTechnologies(req: GetAllTechnologiesRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getAllTechnologiesSchema.parse({ query: req.query });
      const { page, limit, include, sort } = validatedQuery.query;
      
      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['projects', 'services'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'projects' | 'services'] = true;
          }
        });
      }

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        include: includeOptions,
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const technologies = await technologyService.getAllTechnologies(options);
      const total = await technologyService.getTechnologiesCount();

      sendPaginatedResponse(res, technologies, {
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

  // GET /api/technologies/:id
  async getTechnologyById(req: GetTechnologyByIdRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and query
      const validatedData = getTechnologyByIdSchema.parse({
        params: req.params,
        query: req.query
      });

      const { id } = validatedData.params;
      const { include } = validatedData.query;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['projects', 'services'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'projects' | 'services'] = true;
          }
        });
      }

      const technology = await technologyService.getTechnologyById(id, includeOptions);
      sendSuccessResponse(res, technology);

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

  // GET /api/technologies/search
  async searchTechnologies(req: SearchTechnologyRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = searchTechnologySchema.parse({ query: req.query });
      const { q, page, limit, include, sort } = validatedQuery.query;

      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['projects', 'services'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'projects' | 'services'] = true;
          }
        });
      }

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        include: includeOptions,
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const technologies = await technologyService.searchTechnologies(q, options);
      const total = await technologyService.getSearchCount(q);

      const response = {
        success: true,
        data: technologies,
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

  // POST /api/technologies
  async createTechnology(req: CreateTechnologyRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = createTechnologySchema.parse({ body: req.body });
      const { name, icon, description } = validatedData.body;

      const technologyData = {
        name: name.trim(),
        icon: icon || null,
        description: description || null
      };

      const technology = await technologyService.createTechnology(technologyData);
      sendCreatedResponse(res, technology, 'Technology created successfully');

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

  // PUT /api/technologies/:id
  async updateTechnology(req: UpdateTechnologyRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const validatedData = updateTechnologySchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      // Clean update data
      const cleanUpdateData: { name?: string; icon?: string | null; description?: string | null } = {};
      if (updateData.name !== undefined) cleanUpdateData.name = updateData.name.trim();
      if (updateData.icon !== undefined) cleanUpdateData.icon = updateData.icon || null;
      if (updateData.description !== undefined) cleanUpdateData.description = updateData.description || null;

      const technology = await technologyService.updateTechnology(id, cleanUpdateData);
      sendSuccessResponse(res, technology, 'Technology updated successfully');

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

  // DELETE /api/technologies/:id
  async deleteTechnology(req: DeleteTechnologyRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteTechnologySchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await technologyService.deleteTechnology(id);
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

  // GET /api/technologies/name/:name
  async getTechnologyByName(req: GetTechnologyByNameRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and query
      const validatedData = getTechnologyByNameSchema.parse({
        params: req.params,
        query: req.query
      });

      const { name } = validatedData.params;
      const { include } = validatedData.query;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['projects', 'services'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'projects' | 'services'] = true;
          }
        });
      }

      const technology = await technologyService.getTechnologyByName(name, includeOptions);
      sendSuccessResponse(res, technology);

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
}

export default new TechnologyController();