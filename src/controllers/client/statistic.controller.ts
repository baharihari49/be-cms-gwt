// controllers/statisticController.ts
import { Response } from 'express';
import statisticService from '../../services/statisticService';
import {
  GetAllStatisticsRequest,
  GetStatisticByIdRequest,
  CreateStatisticRequest,
  UpdateStatisticRequest,
  DeleteStatisticRequest
} from '../../types/statistic/requestTypes';
import {
  createStatisticSchema,
  updateStatisticSchema,
  getStatisticByIdSchema,
  deleteStatisticSchema,
  getAllStatisticsSchema,
  formatZodError
} from '../../schemas/statisticSchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class StatisticController {
  // GET /api/statistics
  async getAllStatistics(req: GetAllStatisticsRequest, res: Response): Promise<void> {
    try {
      const validatedQuery = getAllStatisticsSchema.parse({ query: req.query });
      const { page, limit, sort, isActive } = validatedQuery.query;
      
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (isActive !== undefined) where.isActive = isActive;

      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'label', 'order', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        where: where,
        skip: skip,
        take: limitNum,
        orderBy: orderBy || { order: 'asc' }
      };

      const statistics = await statisticService.getAllStatistics(options);
      const total = await statisticService.getStatisticsCount(where);

      sendPaginatedResponse(res, statistics, {
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

  // GET /api/statistics/:id
  async getStatisticById(req: GetStatisticByIdRequest, res: Response): Promise<void> {
    try {
      const validatedData = getStatisticByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const statistic = await statisticService.getStatisticById(id);
      sendSuccessResponse(res, statistic);

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

  // POST /api/statistics
  async createStatistic(req: CreateStatisticRequest, res: Response): Promise<void> {
    try {
      const validatedData = createStatisticSchema.parse({ body: req.body });
      const { icon, number, label, order, isActive } = validatedData.body;

      const statisticData = {
        icon: icon.trim(),
        number: number.trim(),
        label: label.trim(),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      };

      const statistic = await statisticService.createStatistic(statisticData);
      sendCreatedResponse(res, statistic, 'Statistic created successfully');

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

  // PUT /api/statistics/:id
  async updateStatistic(req: UpdateStatisticRequest, res: Response): Promise<void> {
    try {
      const validatedData = updateStatisticSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const cleanUpdateData: any = {};
      if (updateData.icon !== undefined) cleanUpdateData.icon = updateData.icon.trim();
      if (updateData.number !== undefined) cleanUpdateData.number = updateData.number.trim();
      if (updateData.label !== undefined) cleanUpdateData.label = updateData.label.trim();
      if (updateData.order !== undefined) cleanUpdateData.order = updateData.order;
      if (updateData.isActive !== undefined) cleanUpdateData.isActive = updateData.isActive;

      const statistic = await statisticService.updateStatistic(id, cleanUpdateData);
      sendSuccessResponse(res, statistic, 'Statistic updated successfully');

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

  // DELETE /api/statistics/:id
  async deleteStatistic(req: DeleteStatisticRequest, res: Response): Promise<void> {
    try {
      const validatedData = deleteStatisticSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await statisticService.deleteStatistic(id);
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

export default new StatisticController();