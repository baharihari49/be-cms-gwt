// controllers/aboutUsController.ts
import { Request, Response } from 'express';
import {
  companyValueService,
  timelineItemService,
  companyStatService,
  companyInfoService,
  aboutUsService
} from '../../services/aboutUsServices';
import {
  GetCompanyValueByIdRequest,
  CreateCompanyValueRequest,
  UpdateCompanyValueRequest,
  DeleteCompanyValueRequest,
  GetAllCompanyValuesRequest,
  GetTimelineItemByIdRequest,
  CreateTimelineItemRequest,
  UpdateTimelineItemRequest,
  DeleteTimelineItemRequest,
  GetAllTimelineItemsRequest,
  GetCompanyStatByIdRequest,
  CreateCompanyStatRequest,
  UpdateCompanyStatRequest,
  DeleteCompanyStatRequest,
  GetAllCompanyStatsRequest,
  GetCompanyInfoByIdRequest,
  CreateCompanyInfoRequest,
  UpdateCompanyInfoRequest,
  DeleteCompanyInfoRequest,
  GetAllCompanyInfoRequest,
  GetCompleteAboutUsRequest
} from '../../types/aboutus/aboutUsTypes';
import {
  createCompanyValueSchema,
  updateCompanyValueSchema,
  getCompanyValueByIdSchema,
  deleteCompanyValueSchema,
  getAllCompanyValuesSchema,
  createTimelineItemSchema,
  updateTimelineItemSchema,
  getTimelineItemByIdSchema,
  deleteTimelineItemSchema,
  getAllTimelineItemsSchema,
  createCompanyStatSchema,
  updateCompanyStatSchema,
  getCompanyStatByIdSchema,
  deleteCompanyStatSchema,
  getAllCompanyStatsSchema,
  createCompanyInfoSchema,
  updateCompanyInfoSchema,
  getCompanyInfoByIdSchema,
  deleteCompanyInfoSchema,
  getAllCompanyInfoSchema,
  formatZodError
} from '../../schemas/aboutUsSchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

// Company Value Controller
class CompanyValueController {
  // GET /api/about-us/company-values
  async getAllCompanyValues(req: GetAllCompanyValuesRequest, res: Response): Promise<void> {
    try {
      const validatedQuery = getAllCompanyValuesSchema.parse({ query: req.query });
      const { page, limit, sort } = validatedQuery.query;
      
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = { order: 'asc' };
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'order', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const companyValues = await companyValueService.getAllCompanyValues(options);
      const total = await companyValueService.getCompanyValuesCount();

      sendPaginatedResponse(res, companyValues, {
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

  // GET /api/about-us/company-values/:id
  async getCompanyValueById(req: GetCompanyValueByIdRequest, res: Response): Promise<void> {
    try {
      const validatedData = getCompanyValueByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const companyValue = await companyValueService.getCompanyValueById(id);
      sendSuccessResponse(res, companyValue);

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

  // POST /api/about-us/company-values
  async createCompanyValue(req: CreateCompanyValueRequest, res: Response): Promise<void> {
    try {
      const validatedData = createCompanyValueSchema.parse({ body: req.body });
      const companyValueData = validatedData.body;

      const companyValue = await companyValueService.createCompanyValue(companyValueData);
      sendCreatedResponse(res, companyValue, 'Company value created successfully');

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

  // PUT /api/about-us/company-values/:id
  async updateCompanyValue(req: UpdateCompanyValueRequest, res: Response): Promise<void> {
    try {
      const validatedData = updateCompanyValueSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const companyValue = await companyValueService.updateCompanyValue(id, updateData);
      sendSuccessResponse(res, companyValue, 'Company value updated successfully');

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

  // DELETE /api/about-us/company-values/:id
  async deleteCompanyValue(req: DeleteCompanyValueRequest, res: Response): Promise<void> {
    try {
      const validatedData = deleteCompanyValueSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await companyValueService.deleteCompanyValue(id);
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

// Timeline Item Controller
class TimelineItemController {
  // GET /api/about-us/timeline-items
  async getAllTimelineItems(req: GetAllTimelineItemsRequest, res: Response): Promise<void> {
    try {
      const validatedQuery = getAllTimelineItemsSchema.parse({ query: req.query });
      const { page, limit, sort } = validatedQuery.query;
      
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = { order: 'asc' };
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'order', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const timelineItems = await timelineItemService.getAllTimelineItems(options);
      const total = await timelineItemService.getTimelineItemsCount();

      sendPaginatedResponse(res, timelineItems, {
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

  // GET /api/about-us/timeline-items/:id
  async getTimelineItemById(req: GetTimelineItemByIdRequest, res: Response): Promise<void> {
    try {
      const validatedData = getTimelineItemByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const timelineItem = await timelineItemService.getTimelineItemById(id);
      sendSuccessResponse(res, timelineItem);

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

  // POST /api/about-us/timeline-items
  async createTimelineItem(req: CreateTimelineItemRequest, res: Response): Promise<void> {
    try {
      const validatedData = createTimelineItemSchema.parse({ body: req.body });
      const timelineItemData = validatedData.body;

      const timelineItem = await timelineItemService.createTimelineItem(timelineItemData);
      sendCreatedResponse(res, timelineItem, 'Timeline item created successfully');

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

  // PUT /api/about-us/timeline-items/:id
  async updateTimelineItem(req: UpdateTimelineItemRequest, res: Response): Promise<void> {
    try {
      const validatedData = updateTimelineItemSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const timelineItem = await timelineItemService.updateTimelineItem(id, updateData);
      sendSuccessResponse(res, timelineItem, 'Timeline item updated successfully');

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

  // DELETE /api/about-us/timeline-items/:id
  async deleteTimelineItem(req: DeleteTimelineItemRequest, res: Response): Promise<void> {
    try {
      const validatedData = deleteTimelineItemSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await timelineItemService.deleteTimelineItem(id);
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

// Company Stat Controller
class CompanyStatController {
  // GET /api/about-us/company-stats
  async getAllCompanyStats(req: GetAllCompanyStatsRequest, res: Response): Promise<void> {
    try {
      const validatedQuery = getAllCompanyStatsSchema.parse({ query: req.query });
      const { page, limit, sort } = validatedQuery.query;
      
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = { order: 'asc' };
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'order', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const companyStats = await companyStatService.getAllCompanyStats(options);
      const total = await companyStatService.getCompanyStatsCount();

      sendPaginatedResponse(res, companyStats, {
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

  // GET /api/about-us/company-stats/:id
  async getCompanyStatById(req: GetCompanyStatByIdRequest, res: Response): Promise<void> {
    try {
      const validatedData = getCompanyStatByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const companyStat = await companyStatService.getCompanyStatById(id);
      sendSuccessResponse(res, companyStat);

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

  // POST /api/about-us/company-stats
  async createCompanyStat(req: CreateCompanyStatRequest, res: Response): Promise<void> {
    try {
      const validatedData = createCompanyStatSchema.parse({ body: req.body });
      const companyStatData = validatedData.body;

      const companyStat = await companyStatService.createCompanyStat(companyStatData);
      sendCreatedResponse(res, companyStat, 'Company stat created successfully');

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

  // PUT /api/about-us/company-stats/:id
  async updateCompanyStat(req: UpdateCompanyStatRequest, res: Response): Promise<void> {
    try {
      const validatedData = updateCompanyStatSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const companyStat = await companyStatService.updateCompanyStat(id, updateData);
      sendSuccessResponse(res, companyStat, 'Company stat updated successfully');

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

  // DELETE /api/about-us/company-stats/:id
  async deleteCompanyStat(req: DeleteCompanyStatRequest, res: Response): Promise<void> {
    try {
      const validatedData = deleteCompanyStatSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await companyStatService.deleteCompanyStat(id);
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

// Company Info Controller
class CompanyInfoController {
  // GET /api/about-us/company-info
  async getAllCompanyInfo(req: GetAllCompanyInfoRequest, res: Response): Promise<void> {
    try {
      const validatedQuery = getAllCompanyInfoSchema.parse({ query: req.query });
      const { page, limit, sort } = validatedQuery.query;
      
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = { createdAt: 'desc' };
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const companyInfo = await companyInfoService.getAllCompanyInfo(options);
      const total = await companyInfoService.getCompanyInfoCount();

      sendPaginatedResponse(res, companyInfo, {
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

  // GET /api/about-us/company-info/:id
  async getCompanyInfoById(req: GetCompanyInfoByIdRequest, res: Response): Promise<void> {
    try {
      const validatedData = getCompanyInfoByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const companyInfo = await companyInfoService.getCompanyInfoById(id);
      sendSuccessResponse(res, companyInfo);

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

  // GET /api/about-us/company-info/main
  async getMainCompanyInfo(req: Request, res: Response): Promise<void> {
    try {
      const companyInfo = await companyInfoService.getMainCompanyInfo();
      sendSuccessResponse(res, companyInfo);

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // POST /api/about-us/company-info
  async createCompanyInfo(req: CreateCompanyInfoRequest, res: Response): Promise<void> {
    try {
      const validatedData = createCompanyInfoSchema.parse({ body: req.body });
      const companyInfoData = validatedData.body;

      const companyInfo = await companyInfoService.createCompanyInfo(companyInfoData);
      sendCreatedResponse(res, companyInfo, 'Company info created successfully');

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

  // PUT /api/about-us/company-info/:id
  async updateCompanyInfo(req: UpdateCompanyInfoRequest, res: Response): Promise<void> {
    try {
      const validatedData = updateCompanyInfoSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const companyInfo = await companyInfoService.updateCompanyInfo(id, updateData);
      sendSuccessResponse(res, companyInfo, 'Company info updated successfully');

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

  // DELETE /api/about-us/company-info/:id
  async deleteCompanyInfo(req: DeleteCompanyInfoRequest, res: Response): Promise<void> {
    try {
      const validatedData = deleteCompanyInfoSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await companyInfoService.deleteCompanyInfo(id);
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

// Main About Us Controller
class AboutUsController {
  // GET /api/about-us/complete
  async getCompleteAboutUsData(req: GetCompleteAboutUsRequest, res: Response): Promise<void> {
    try {
      const completeData = await aboutUsService.getCompleteAboutUsData();
      sendSuccessResponse(res, completeData, 'Complete about us data retrieved successfully');

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }
}

// Export controller instances
export const companyValueController = new CompanyValueController();
export const timelineItemController = new TimelineItemController();
export const companyStatController = new CompanyStatController();
export const companyInfoController = new CompanyInfoController();
export const aboutUsController = new AboutUsController();

export default {
  companyValueController,
  timelineItemController,
  companyStatController,
  companyInfoController,
  aboutUsController
};