// controllers/faq.controller.ts
import { Request, Response } from 'express';
import { faqService } from '../../services/faqService';
import type { APIResponse } from '../../types/faq/faqTypes';

export class FAQController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await faqService.getStats();

      const response: APIResponse<typeof stats> = {
        success: true,
        data: stats,
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

  async getGroupedByCategory(req: Request, res: Response): Promise<void> {
    try {
      const grouped = await faqService.getGroupedByCategory();

      const response: APIResponse<typeof grouped> = {
        success: true,
        data: grouped,
        meta: {
          categoriesCount: grouped.length,
          totalItems: grouped.reduce((sum, cat) => sum + cat.items.length, 0),
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

export const faqController = new FAQController();