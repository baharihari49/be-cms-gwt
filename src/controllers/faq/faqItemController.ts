// controllers/faq-item.controller.ts
import { Request, Response } from 'express';
import { faqItemService } from '../../services/faqItemService';
import type {
  CreateFAQItemRequest,
  UpdateFAQItemRequest,
  SearchOptions,
  APIResponse,
} from '../../types/faq/faqTypes';

export class FAQItemController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        includeCategory = 'true',
        skip = '0',
        take,
      } = req.query;

      const options = {
        includeCategory: includeCategory === 'true',
        skip: parseInt(skip as string, 10),
        take: take ? parseInt(take as string, 10) : undefined,
      };

      const [items, total] = await Promise.all([
        faqItemService.getAll(options),
        faqItemService.count(),
      ]);

      const response: APIResponse<typeof items> = {
        success: true,
        data: items,
        meta: {
          total,
          count: items.length,
          skip: options.skip,
          take: options.take,
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
      const { includeCategory = 'false' } = req.query;

      const itemId = parseInt(id, 10);
      if (isNaN(itemId)) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Invalid FAQ item ID',
        };
        res.status(400).json(response);
        return;
      }

      const item = await faqItemService.getById(itemId, includeCategory === 'true');

      const response: APIResponse<typeof item> = {
        success: true,
        data: item,
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
      const data: CreateFAQItemRequest = req.body;
      const item = await faqItemService.create(data);

      const response: APIResponse<typeof item> = {
        success: true,
        data: item,
        message: 'FAQ item created successfully',
      };

      res.status(201).json(response);
    } catch (error: any) {
      const status = error.message.includes('required') || error.message.includes('does not exist') ? 400 : 500;
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
      const data: UpdateFAQItemRequest = req.body;

      const itemId = parseInt(id, 10);
      if (isNaN(itemId)) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Invalid FAQ item ID',
        };
        res.status(400).json(response);
        return;
      }

      const item = await faqItemService.update(itemId, data);

      const response: APIResponse<typeof item> = {
        success: true,
        data: item,
        message: 'FAQ item updated successfully',
      };

      res.status(200).json(response);
    } catch (error: any) {
      let status = 500;
      if (error.message.includes('not found')) status = 404;
      if (error.message.includes('does not exist')) status = 400;

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

      const itemId = parseInt(id, 10);
      if (isNaN(itemId)) {
        const response: APIResponse<null> = {
          success: false,
          error: 'Invalid FAQ item ID',
        };
        res.status(400).json(response);
        return;
      }

      await faqItemService.delete(itemId);

      const response: APIResponse<null> = {
        success: true,
        message: 'FAQ item deleted successfully',
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

  async search(req: Request, res: Response): Promise<void> {
    try {
      const {
        query,
        category,
        popular,
        includeCategory = 'true',
        skip = '0',
        take,
      } = req.query;

      const options: SearchOptions = {
        query: query as string,
        category: category as string,
        popular: popular === 'true' ? true : popular === 'false' ? false : undefined,
        includeCategory: includeCategory === 'true',
        skip: parseInt(skip as string, 10),
        take: take ? parseInt(take as string, 10) : undefined,
      };

      const [items, total] = await Promise.all([
        faqItemService.search(options),
        faqItemService.countSearch(options),
      ]);

      const response: APIResponse<typeof items> = {
        success: true,
        data: items,
        meta: {
          total,
          count: items.length,
          skip: options.skip,
          take: options.take,
          filters: {
            query: options.query,
            category: options.category,
            popular: options.popular,
          },
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

  async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const { includeCategory = 'false', skip = '0', take } = req.query;

      const options = {
        includeCategory: includeCategory === 'true',
        skip: parseInt(skip as string, 10),
        take: take ? parseInt(take as string, 10) : undefined,
      };

      const [items, total] = await Promise.all([
        faqItemService.getByCategory(category, options),
        faqItemService.countByCategory(category),
      ]);

      const response: APIResponse<typeof items> = {
        success: true,
        data: items,
        meta: {
          total,
          count: items.length,
          category,
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

  async getPopular(req: Request, res: Response): Promise<void> {
    try {
      const { includeCategory = 'false', skip = '0', take } = req.query;

      const options = {
        includeCategory: includeCategory === 'true',
        skip: parseInt(skip as string, 10),
        take: take ? parseInt(take as string, 10) : undefined,
      };

      const [items, total] = await Promise.all([
        faqItemService.getPopular(options),
        faqItemService.countPopular(),
      ]);

      const response: APIResponse<typeof items> = {
        success: true,
        data: items,
        meta: {
          total,
          count: items.length,
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

export const faqItemController = new FAQItemController();