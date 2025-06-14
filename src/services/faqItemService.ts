// services/faq-item.service.ts
import { PrismaClient } from '@prisma/client';
import type {
  FAQItem,
  FAQItemWithCategory,
  CreateFAQItemRequest,
  UpdateFAQItemRequest,
  PaginationOptions,
  SearchOptions,
} from '../types/faq/faqTypes';

const prisma = new PrismaClient();

export class FAQItemService {
  async getAll(options: PaginationOptions = {}): Promise<(FAQItem | FAQItemWithCategory)[]> {
    try {
      const { skip = 0, take, includeCategory = false } = options;

      const items = await prisma.fAQItem.findMany({
        skip,
        take,
        orderBy: { id: 'asc' },
        include: {
          faqCategory: includeCategory,
        },
      });

      return items;
    } catch (error) {
      throw new Error(`Failed to fetch FAQ items: ${error}`);
    }
  }

  async getById(id: number, includeCategory = false): Promise<FAQItem | FAQItemWithCategory> {
    try {
      const item = await prisma.fAQItem.findUnique({
        where: { id },
        include: {
          faqCategory: includeCategory,
        },
      });

      if (!item) {
        throw new Error('FAQ item not found');
      }

      return item;
    } catch (error) {
      throw new Error(`Failed to fetch FAQ item: ${error}`);
    }
  }

  async create(data: CreateFAQItemRequest): Promise<FAQItem> {
    try {
      // Validate
      if (!data.category?.trim()) throw new Error('Category is required');
      if (!data.question?.trim()) throw new Error('Question is required');
      if (!data.answer?.trim()) throw new Error('Answer is required');

      // Check if category exists
      const categoryExists = await prisma.fAQCategory.findUnique({
        where: { id: data.category },
      });

      if (!categoryExists) {
        throw new Error('Category does not exist');
      }

      const item = await prisma.fAQItem.create({
        data: {
          category: data.category.trim(),
          question: data.question.trim(),
          answer: data.answer.trim(),
          popular: data.popular || false,
        },
      });

      return item;
    } catch (error) {
      throw new Error(`Failed to create FAQ item: ${error}`);
    }
  }

  async update(id: number, data: UpdateFAQItemRequest): Promise<FAQItem> {
    try {
      // Check if item exists
      await this.getById(id);

      // Check category if provided
      if (data.category) {
        const categoryExists = await prisma.fAQCategory.findUnique({
          where: { id: data.category },
        });

        if (!categoryExists) {
          throw new Error('Category does not exist');
        }
      }

      // Build update object
      const updateData: any = {};
      if (data.category !== undefined) updateData.category = data.category.trim();
      if (data.question !== undefined) updateData.question = data.question.trim();
      if (data.answer !== undefined) updateData.answer = data.answer.trim();
      if (data.popular !== undefined) updateData.popular = data.popular;

      const item = await prisma.fAQItem.update({
        where: { id },
        data: updateData,
      });

      return item;
    } catch (error) {
      throw new Error(`Failed to update FAQ item: ${error}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.getById(id);

      await prisma.fAQItem.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete FAQ item: ${error}`);
    }
  }

  async search(options: SearchOptions): Promise<(FAQItem | FAQItemWithCategory)[]> {
    try {
      const { query, category, popular, skip = 0, take, includeCategory = false } = options;

      const whereConditions: any = {};

      if (query) {
        whereConditions.OR = [
          { question: { contains: query, mode: 'insensitive' } },
          { answer: { contains: query, mode: 'insensitive' } },
        ];
      }

      if (category) whereConditions.category = category;
      if (popular !== undefined) whereConditions.popular = popular;

      const items = await prisma.fAQItem.findMany({
        where: whereConditions,
        skip,
        take,
        orderBy: { id: 'asc' },
        include: {
          faqCategory: includeCategory,
        },
      });

      return items;
    } catch (error) {
      throw new Error(`Failed to search FAQ items: ${error}`);
    }
  }

  async getByCategory(category: string, options: PaginationOptions = {}): Promise<(FAQItem | FAQItemWithCategory)[]> {
    return this.search({ ...options, category });
  }

  async getPopular(options: PaginationOptions = {}): Promise<(FAQItem | FAQItemWithCategory)[]> {
    return this.search({ ...options, popular: true });
  }

  async count(): Promise<number> {
    try {
      return await prisma.fAQItem.count();
    } catch (error) {
      throw new Error(`Failed to count FAQ items: ${error}`);
    }
  }

  async countSearch(options: SearchOptions): Promise<number> {
    try {
      const { query, category, popular } = options;

      const whereConditions: any = {};

      if (query) {
        whereConditions.OR = [
          { question: { contains: query, mode: 'insensitive' } },
          { answer: { contains: query, mode: 'insensitive' } },
        ];
      }

      if (category) whereConditions.category = category;
      if (popular !== undefined) whereConditions.popular = popular;

      return await prisma.fAQItem.count({
        where: whereConditions,
      });
    } catch (error) {
      throw new Error(`Failed to count search results: ${error}`);
    }
  }

  async countByCategory(category: string): Promise<number> {
    try {
      return await prisma.fAQItem.count({
        where: { category },
      });
    } catch (error) {
      throw new Error(`Failed to count category items: ${error}`);
    }
  }

  async countPopular(): Promise<number> {
    try {
      return await prisma.fAQItem.count({
        where: { popular: true },
      });
    } catch (error) {
      throw new Error(`Failed to count popular items: ${error}`);
    }
  }
}

export const faqItemService = new FAQItemService();