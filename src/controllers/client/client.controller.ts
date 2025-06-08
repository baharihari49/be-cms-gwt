// controllers/clientController.ts
import { Response } from 'express';
import clientService from '../../services/clientService';
import {
  GetAllClientsRequest,
  GetClientByIdRequest,
  CreateClientRequest,
  UpdateClientRequest,
  DeleteClientRequest,
  SearchClientRequest
} from '../../types/clients/requestTypes';
import {
  createClientSchema,
  updateClientSchema,
  getClientByIdSchema,
  deleteClientSchema,
  searchClientSchema,
  getAllClientsSchema,
  formatZodError
} from '../../schemas/clientSchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class ClientController {
  // GET /api/clients
  async getAllClients(req: GetAllClientsRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getAllClientsSchema.parse({ query: req.query });
      const { page, limit, sort, industry, isActive } = validatedQuery.query;
      
      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: any = {};
      if (industry) where.industry = { contains: industry };
      if (isActive !== undefined) where.isActive = isActive;

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name', 'industry', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        where: where,
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const clients = await clientService.getAllClients(options);
      const total = await clientService.getClientsCount(where);

      sendPaginatedResponse(res, clients, {
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

  // GET /api/clients/:id
  async getClientById(req: GetClientByIdRequest, res: Response): Promise<void> {
    try {
      const validatedData = getClientByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const client = await clientService.getClientById(id);
      sendSuccessResponse(res, client);

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

  // GET /api/clients/search
  async searchClients(req: SearchClientRequest, res: Response): Promise<void> {
    try {
      const validatedQuery = searchClientSchema.parse({ query: req.query });
      const { q, page, limit, sort } = validatedQuery.query;

      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'name', 'industry', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const clients = await clientService.searchClients(q, options);
      const total = await clientService.getSearchCount(q);

      const response = {
        success: true,
        data: clients,
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

  // POST /api/clients
  async createClient(req: CreateClientRequest, res: Response): Promise<void> {
    try {
      const validatedData = createClientSchema.parse({ body: req.body });
      const { name, industry, image, isActive } = validatedData.body;

      const clientData = {
        name: name.trim(),
        industry: industry.trim(),
        image: image || null,
        isActive: isActive !== undefined ? isActive : true
      };

      const client = await clientService.createClient(clientData);
      sendCreatedResponse(res, client, 'Client created successfully');

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

  // PUT /api/clients/:id
  async updateClient(req: UpdateClientRequest, res: Response): Promise<void> {
    try {
      const validatedData = updateClientSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const cleanUpdateData: any = {};
      if (updateData.name !== undefined) cleanUpdateData.name = updateData.name.trim();
      if (updateData.industry !== undefined) cleanUpdateData.industry = updateData.industry.trim();
      if (updateData.image !== undefined) cleanUpdateData.image = updateData.image || null;
      if (updateData.isActive !== undefined) cleanUpdateData.isActive = updateData.isActive;

      const client = await clientService.updateClient(id, cleanUpdateData);
      sendSuccessResponse(res, client, 'Client updated successfully');

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

  // DELETE /api/clients/:id
  async deleteClient(req: DeleteClientRequest, res: Response): Promise<void> {
    try {
      const validatedData = deleteClientSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await clientService.deleteClient(id);
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
}

export default new ClientController();