// controllers/testimonialController.ts
import { Response } from 'express';
import testimonialService from '../../services/testimonialService';
import {
  GetAllTestimonialsRequest,
  GetTestimonialByIdRequest,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
  DeleteTestimonialRequest,
  SearchTestimonialRequest
} from '../../types/testimonial/requestTypes';
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  getTestimonialByIdSchema,
  deleteTestimonialSchema,
  searchTestimonialSchema,
  getAllTestimonialsSchema,
  formatZodError
} from '../../schemas/testimonialSchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class TestimonialController {
  // GET /api/testimonials
  async getAllTestimonials(req: GetAllTestimonialsRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getAllTestimonialsSchema.parse({ query: req.query });
      const { page, limit, sort, projectId, clientId } = validatedQuery.query;
      
      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse sorting - Updated field names to match database schema
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        // Updated valid fields to match database schema
        if (['id', 'author', 'company', 'rating', 'createdAt', 'role'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy,
        projectId: projectId,
        clientId: clientId
      };

      const testimonials = await testimonialService.getAllTestimonials(options);
      const total = await testimonialService.getTestimonialsCount({
        projectId: projectId,
        clientId: clientId
      });

      sendPaginatedResponse(res, testimonials, {
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

  // GET /api/testimonials/:id
  async getTestimonialById(req: GetTestimonialByIdRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = getTestimonialByIdSchema.parse({
        params: req.params
      });

      const { id } = validatedData.params;

      const testimonial = await testimonialService.getTestimonialById(id);
      sendSuccessResponse(res, testimonial);

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

  // GET /api/testimonials/search
  async searchTestimonials(req: SearchTestimonialRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = searchTestimonialSchema.parse({ query: req.query });
      const { q, page, limit, sort, projectId, clientId } = validatedQuery.query;

      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse sorting - Updated field names
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'author', 'company', 'rating', 'createdAt', 'role'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy,
        projectId: projectId,
        clientId: clientId
      };

      const testimonials = await testimonialService.searchTestimonials(q, options);
      const total = await testimonialService.getSearchCount(q, {
        projectId: projectId,
        clientId: clientId
      });

      const response = {
        success: true,
        data: testimonials,
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

  // POST /api/testimonials
  async createTestimonial(req: CreateTestimonialRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = createTestimonialSchema.parse({ body: req.body });
      const { author, role, company, content, rating, avatar, projectId, clientId } = validatedData.body;

      const testimonialData = {
        author: author.trim(),
        role: role?.trim() || null,
        company: company?.trim() || null,
        content: content.trim(),
        rating: rating || null,
        avatar: avatar || null,
        projectId: projectId || null,
        clientId: clientId || null
      };

      const testimonial = await testimonialService.createTestimonial(testimonialData);
      sendCreatedResponse(res, testimonial, 'Testimonial created successfully');

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

  // PUT /api/testimonials/:id
  async updateTestimonial(req: UpdateTestimonialRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const validatedData = updateTestimonialSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      // Clean update data - Updated field names
      const cleanUpdateData: any = {};
      if (updateData.author !== undefined) cleanUpdateData.author = updateData.author.trim();
      if (updateData.role !== undefined) cleanUpdateData.role = updateData.role?.trim() || null;
      if (updateData.company !== undefined) cleanUpdateData.company = updateData.company?.trim() || null;
      if (updateData.content !== undefined) cleanUpdateData.content = updateData.content.trim();
      if (updateData.rating !== undefined) cleanUpdateData.rating = updateData.rating;
      if (updateData.avatar !== undefined) cleanUpdateData.avatar = updateData.avatar || null;
      if (updateData.projectId !== undefined) cleanUpdateData.projectId = updateData.projectId;
      if (updateData.clientId !== undefined) cleanUpdateData.clientId = updateData.clientId;

      const testimonial = await testimonialService.updateTestimonial(id, cleanUpdateData);
      sendSuccessResponse(res, testimonial, 'Testimonial updated successfully');

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

  // DELETE /api/testimonials/:id
  async deleteTestimonial(req: DeleteTestimonialRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteTestimonialSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await testimonialService.deleteTestimonial(id);
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

  // GET /api/testimonials/project/:projectId
  async getTestimonialsByProject(req: any, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      
      if (isNaN(projectId)) {
        sendErrorResponse(res, 'Invalid project ID', 400);
        return;
      }

      const { page, limit, sort } = req.query;
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'author', 'company', 'rating', 'createdAt', 'role'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const testimonials = await testimonialService.getTestimonialsByProject(projectId, options);
      const total = await testimonialService.getTestimonialsCount({ projectId });

      sendPaginatedResponse(res, testimonials, {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      });

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/testimonials/client/:clientId
  async getTestimonialsByClient(req: any, res: Response): Promise<void> {
    try {
      const clientId = parseInt(req.params.clientId, 10);
      
      if (isNaN(clientId)) {
        sendErrorResponse(res, 'Invalid client ID', 400);
        return;
      }

      const { page, limit, sort } = req.query;
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'author', 'company', 'rating', 'createdAt', 'role'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const testimonials = await testimonialService.getTestimonialsByClient(clientId, options);
      const total = await testimonialService.getTestimonialsCount({ clientId });

      sendPaginatedResponse(res, testimonials, {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      });

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/testimonials/stats
  async getTestimonialsStats(req: any, res: Response): Promise<void> {
    try {
      const stats = await testimonialService.getTestimonialsStats();
      sendSuccessResponse(res, stats);

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/testimonials/featured
  async getFeaturedTestimonials(req: any, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitNum = limit ? parseInt(limit, 10) : 5;

      const testimonials = await testimonialService.getFeaturedTestimonials(limitNum);
      sendSuccessResponse(res, testimonials);

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }
}

export default new TestimonialController();