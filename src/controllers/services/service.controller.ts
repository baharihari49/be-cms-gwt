// controllers/serviceController.ts
import { Response } from 'express';
import serviceService from '../../services/serviceService';
import {
  ServiceRequest,
  GetServiceByIdRequest,
  GetServiceByTitleRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  DeleteServiceRequest,
  SearchServiceRequest,
  GetAllServicesRequest
} from '../../types/services/requestTypes';
import {
  ServiceResponse,
  ServicesResponse,
  ServiceSearchResponse,
  IncludeOptions,
  ErrorResponse
} from '../../types/services/serviceTypes';
import {
  createServiceSchema,
  updateServiceSchema,
  getServiceByIdSchema,
  getServiceByTitleSchema,
  deleteServiceSchema,
  searchServiceSchema,
  getAllServicesSchema,
  formatZodError
} from '../../schemas/serviceSchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class ServiceController {
  // GET /api/services
  async getAllServices(req: GetAllServicesRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getAllServicesSchema.parse({ query: req.query });
      const { page, limit, include, sort } = validatedQuery.query;
      
      // Parse pagination with safe defaults
      const pageNum = typeof page === 'number' ? page : 1;
      const limitNum = typeof limit === 'number' ? limit : 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['features', 'technologies'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'features' | 'technologies'] = true;
          }
        });
      }

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'title', 'createdAt', 'updatedAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        include: includeOptions,
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const services = await serviceService.getAllServices(options);
      const total = await serviceService.getServicesCount();

      sendPaginatedResponse(res, services, {
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

  // GET /api/services/:id
  async getServiceById(req: GetServiceByIdRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and query
      const validatedData = getServiceByIdSchema.parse({
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
          if (['features', 'technologies'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'features' | 'technologies'] = true;
          }
        });
      }

      const service = await serviceService.getServiceById(id, includeOptions);
      sendSuccessResponse(res, service);

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

  // GET /api/services/search
  async searchServices(req: SearchServiceRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = searchServiceSchema.parse({ query: req.query });
      const { q, page, limit, include, sort } = validatedQuery.query;

      // Parse pagination with safe defaults
      const pageNum = typeof page === 'number' ? page : 1;
      const limitNum = typeof limit === 'number' ? limit : 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['features', 'technologies'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'features' | 'technologies'] = true;
          }
        });
      }

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'title', 'createdAt', 'updatedAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        include: includeOptions,
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const services = await serviceService.searchServices(q, options);
      const total = await serviceService.getSearchCount(q);

      const response = {
        success: true,
        data: services,
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

  // POST /api/services
  async createService(req: CreateServiceRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = createServiceSchema.parse({ body: req.body });
      const { icon, title, subtitle, description, color, features, technologyIds } = validatedData.body;

      const serviceData = {
        icon: icon.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        color: color.trim(),
        features: features || [],
        technologyIds: technologyIds || []
      };

      const service = await serviceService.createService(serviceData);
      sendCreatedResponse(res, service, 'Service created successfully');

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

  // PUT /api/services/:id
  async updateService(req: UpdateServiceRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const validatedData = updateServiceSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      // Clean update data
      const cleanUpdateData: any = {};
      if (updateData.icon !== undefined) cleanUpdateData.icon = updateData.icon.trim();
      if (updateData.title !== undefined) cleanUpdateData.title = updateData.title.trim();
      if (updateData.subtitle !== undefined) cleanUpdateData.subtitle = updateData.subtitle.trim();
      if (updateData.description !== undefined) cleanUpdateData.description = updateData.description.trim();
      if (updateData.color !== undefined) cleanUpdateData.color = updateData.color.trim();
      if (updateData.features !== undefined) cleanUpdateData.features = updateData.features;
      if (updateData.technologyIds !== undefined) cleanUpdateData.technologyIds = updateData.technologyIds;

      const service = await serviceService.updateService(id, cleanUpdateData);
      sendSuccessResponse(res, service, 'Service updated successfully');

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

  // DELETE /api/services/:id
  async deleteService(req: DeleteServiceRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteServiceSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await serviceService.deleteService(id);
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

  // GET /api/services/title/:title
  async getServiceByTitle(req: GetServiceByTitleRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and query
      const validatedData = getServiceByTitleSchema.parse({
        params: req.params,
        query: req.query
      });

      const { title } = validatedData.params;
      const { include } = validatedData.query;

      // Parse include relations
      const includeOptions: IncludeOptions = {};
      if (include) {
        const includeArray = include.split(',');
        includeArray.forEach(rel => {
          if (['features', 'technologies'].includes(rel.trim())) {
            includeOptions[rel.trim() as 'features' | 'technologies'] = true;
          }
        });
      }

      const service = await serviceService.getServiceByTitle(title, includeOptions);
      sendSuccessResponse(res, service);

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

export default new ServiceController();