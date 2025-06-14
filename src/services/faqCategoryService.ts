// services/faq-category.service.ts
import { PrismaClient } from '@prisma/client';
import type {
  FAQCategory,
  FAQCategoryWithCount,
  CreateFAQCategoryRequest,
  UpdateFAQCategoryRequest,
} from '../types/faq/faqTypes';

const prisma = new PrismaClient();

export class FAQCategoryService {
  async getAll(includeCount = false): Promise<(FAQCategory | FAQCategoryWithCount)[]> {
    try {
      if (includeCount) {
        const categories = await prisma.fAQCategory.findMany({
          include: {
            _count: {
              select: { faqItems: true },
            },
          },
          orderBy: { name: 'asc' },
        });

        return categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
          count: cat._count.faqItems,
        }));
      }

      const categories = await prisma.fAQCategory.findMany({
        orderBy: { name: 'asc' },
      });

      return categories;
    } catch (error) {
      throw new Error(`Failed to fetch FAQ categories: ${error}`);
    }
  }

  async getById(id: string, includeItems = false): Promise<FAQCategory> {
    try {
      const category = await prisma.fAQCategory.findUnique({
        where: { id },
        include: {
          faqItems: includeItems,
        },
      });

      if (!category) {
        throw new Error('FAQ category not found');
      }

      return category;
    } catch (error) {
      throw new Error(`Failed to fetch FAQ category: ${error}`);
    }
  }

  async create(data: CreateFAQCategoryRequest): Promise<FAQCategory> {
    try {
      // Validate
      if (!data.id?.trim()) throw new Error('Category ID is required');
      if (!data.name?.trim()) throw new Error('Category name is required');
      if (!data.icon?.trim()) throw new Error('Category icon is required');

      const category = await prisma.fAQCategory.create({
        data: {
          id: data.id.trim(),
          name: data.name.trim(),
          icon: data.icon.trim(),
        },
      });

      return category;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new Error('Category ID already exists');
      }
      throw new Error(`Failed to create FAQ category: ${error}`);
    }
  }

  async update(id: string, data: UpdateFAQCategoryRequest): Promise<FAQCategory> {
    try {
      // Check if exists
      await this.getById(id);

      // Build update object
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.icon !== undefined) updateData.icon = data.icon.trim();

      const category = await prisma.fAQCategory.update({
        where: { id },
        data: updateData,
      });

      return category;
    } catch (error) {
      throw new Error(`Failed to update FAQ category: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Check if exists and has items
      const category = await prisma.fAQCategory.findUnique({
        where: { id },
        include: { faqItems: true },
      });

      if (!category) {
        throw new Error('FAQ category not found');
      }

      if (category.faqItems.length > 0) {
        throw new Error('Cannot delete category that has associated FAQ items');
      }

      await prisma.fAQCategory.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete FAQ category: ${error}`);
    }
  }

  async count(): Promise<number> {
    try {
      return await prisma.fAQCategory.count();
    } catch (error) {
      throw new Error(`Failed to count FAQ categories: ${error}`);
    }
  }

  async countItems(categoryId: string): Promise<number> {
    try {
      return await prisma.fAQItem.count({
        where: { category: categoryId },
      });
    } catch (error) {
      throw new Error(`Failed to count category items: ${error}`);
    }
  }
}

export const faqCategoryService = new FAQCategoryService();