// services/statisticService.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { 
  Statistic,
  StatisticCreateInput,
  StatisticUpdateInput,
  StatisticQueryOptions
} from '../types/statistic/statisticTypes';

const prisma = new PrismaClient();

class StatisticService {
  // Get all statistics
  async getAllStatistics(options: StatisticQueryOptions = {}): Promise<Statistic[]> {
    const { skip, take, orderBy, where } = options;
    
    try {
      const statistics = await prisma.statistic.findMany({
        where: where || undefined,
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { order: 'asc' }
      });
      
      return statistics;
    } catch (error: any) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

  // Get statistic by ID
  async getStatisticById(id: number): Promise<Statistic> {
    try {
      const statistic = await prisma.statistic.findUnique({
        where: { id }
      });

      if (!statistic) {
        throw new Error('Statistic not found');
      }

      return statistic;
    } catch (error: any) {
      throw new Error(`Failed to fetch statistic: ${error.message}`);
    }
  }

  // Create new statistic
  async createStatistic(data: StatisticCreateInput): Promise<Statistic> {
    try {
      const { icon, number, label, order, isActive } = data;

      const statistic = await prisma.statistic.create({
        data: {
          icon: icon.trim(),
          number: number.trim(),
          label: label.trim(),
          order: order || 0,
          isActive: isActive !== undefined ? isActive : true
        }
      });

      return statistic;
    } catch (error: any) {
      throw new Error(`Failed to create statistic: ${error.message}`);
    }
  }

  // Update statistic
  async updateStatistic(id: number, data: StatisticUpdateInput): Promise<Statistic> {
    try {
      // Check if statistic exists
      await this.getStatisticById(id);

      const updateData: Prisma.StatisticUpdateInput = {};
      if (data.icon !== undefined) updateData.icon = data.icon.trim();
      if (data.number !== undefined) updateData.number = data.number.trim();
      if (data.label !== undefined) updateData.label = data.label.trim();
      if (data.order !== undefined) updateData.order = data.order;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const updatedStatistic = await prisma.statistic.update({
        where: { id },
        data: updateData
      });

      return updatedStatistic;
    } catch (error: any) {
      throw new Error(`Failed to update statistic: ${error.message}`);
    }
  }

  // Delete statistic
  async deleteStatistic(id: number): Promise<{ message: string }> {
    try {
      // Check if statistic exists
      await this.getStatisticById(id);

      await prisma.statistic.delete({
        where: { id }
      });

      return { message: 'Statistic deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete statistic: ${error.message}`);
    }
  }

  // Get statistics count
  async getStatisticsCount(filters: any = {}): Promise<number> {
    try {
      const count = await prisma.statistic.count({
        where: filters
      });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count statistics: ${error.message}`);
    }
  }
}

export default new StatisticService();