// controllers/faq-category.controller.ts
import { Request, Response } from 'express';
import { faqCategoryService } from '../../services/faqCategoryService';
import type { CreateFAQCategoryRequest, UpdateFAQCategoryRequest, APIResponse } from '../../types/faq/faqTypes';

export class FAQCategoryController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { includeCount = 'true' } = req.query;

      const [categories, total] = await Promise.all([
        faqCategoryService.getAll(includeCount === 'true'),
        faqCategoryService.count(),
      ]);

      const response: APIResponse<typeof categories> = {
        success: true,
        data: categories,
        meta: {
          total,
          count: categories.length,
        },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: APIResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { includeItems = 'false' } = req.query;

      const category = await faqCategoryService.getById(id, includeItems === 'true');

      const response: APIResponse<typeof category> = {
        success: true,
        data: category,
      };

      res.status(200).json(response);
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      const response: APIResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(status).json(response);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateFAQCategoryRequest = req.body;
      const category = await faqCategoryService.create(data);

      const response: APIResponse<typeof category> = {
        success: true,
        data: category,
        message: 'FAQ category created successfully',
      };

      res.status(201).json(response);
    } catch (error: any) {
      const status = error.message.includes('required') || error.message.includes('already exists') ? 400 : 500;
      const response: APIResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(status).json(response);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateFAQCategoryRequest = req.body;

      const category = await faqCategoryService.update(id, data);

      const response: APIResponse<typeof category> = {
        success: true,
        data: category,
        message: 'FAQ category updated successfully',
      };

      res.status(200).json(response);
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      const response: APIResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(status).json(response);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await faqCategoryService.delete(id);

      const response: APIResponse<null> = {
        success: true,
        message: 'FAQ category deleted successfully',
      };

      res.status(200).json(response);
    } catch (error: any) {
      let status = 500;
      if (error.message.includes('not found')) status = 404;
      if (error.message.includes('associated FAQ items')) status = 400;

      const response: APIResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(status).json(response);
    }
  }

  async getItemCount(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const count = await faqCategoryService.countItems(id);

      const response: APIResponse<{ count: number }> = {
        success: true,
        data: { count },
        meta: {
          categoryId: id,
        },
      };

      res.status(200).json(response);
    } catch (error: any) {
      const response: APIResponse<null> = {
        success: false,
        error: error.message,
      };
      res.status(500).json(response);
    }
  }
}

export const faqCategoryController = new FAQCategoryController();