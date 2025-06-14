// services/faq.service.ts
import { PrismaClient } from '@prisma/client';
import type { FAQStats, FAQCategory, FAQItem } from '../types/faq/faqTypes';

const prisma = new PrismaClient();

export class FAQService {
  async getStats(): Promise<FAQStats> {
    try {
      const [totalItems, totalCategories, popularItems, itemsByCategory] = await Promise.all([
        prisma.fAQItem.count(),
        prisma.fAQCategory.count(),
        prisma.fAQItem.count({ where: { popular: true } }),
        prisma.fAQItem.groupBy({
          by: ['category'],
          _count: { category: true },
        }),
      ]);

      return {
        totalItems,
        totalCategories,
        popularItems,
        itemsByCategory: itemsByCategory.map((item) => ({
          category: item.category,
          count: item._count.category,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to fetch FAQ stats: ${error}`);
    }
  }

  async getGroupedByCategory(): Promise<Array<{ category: FAQCategory; items: FAQItem[] }>> {
    try {
      const categories = await prisma.fAQCategory.findMany({
        include: {
          faqItems: {
            orderBy: { id: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      });

      return categories.map((cat) => ({
        category: {
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        },
        items: cat.faqItems,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch grouped FAQs: ${error}`);
    }
  }
}

export const faqService = new FAQService();