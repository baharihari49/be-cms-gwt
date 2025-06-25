// src/services/statisticService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Local interfaces (tidak perlu import external)
interface StatisticResult {
  icon: string;
  number: string;
  label: string;
}

interface DebugResult {
  clients: {
    total: number;
    active: number;
    industries: string[];
    data: any[];
  };
  testimonials: {
    total: number;
    withRating: number;
    data: any[];
  };
  statistics: {
    total: number;
    data: any[];
  };
}

interface StatisticCreateData {
  icon: string;
  number: string;
  label: string;
  order: number;
  isActive: boolean;
}

interface StatisticUpdateData {
  icon?: string;
  number?: string;
  label?: string;
  order?: number;
  isActive?: boolean;
}

interface QueryOptions {
  where?: any;
  skip?: number;
  take?: number;
  orderBy?: any;
}

class StatisticService {
  // Method utama: Hitung dan return statistics real-time
  async getStatisticsRealTime(): Promise<StatisticResult[]> {
    try {
      // 1. Hitung Happy Clients dari tabel clients yang isActive = true
      const happyClientsCount = await prisma.client.count({
        where: { isActive: true }
      });

      // 2. Hitung Industries Served dari DISTINCT industry di tabel clients
      const industriesServed = await prisma.client.findMany({
        select: { industry: true },
        distinct: ['industry'],
        where: { isActive: true }
      });
      const industriesCount = industriesServed.length;

      // 3. Countries (hardcode untuk sekarang)
      const countriesCount = 1;

      // 4. Success Rate berdasarkan rata-rata rating dari testimonials
      const testimonialStats = await prisma.testimonial.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { 
          rating: { not: null },
          client: { isActive: true }
        }
      });
      
      // Convert rating (0-5) ke percentage
      const successRate = testimonialStats._avg.rating 
        ? Math.round((testimonialStats._avg.rating / 5) * 100)
        : 98;

      // 5. Return data
      const statistics: StatisticResult[] = [
        {
          icon: 'Users',
          number: happyClientsCount > 0 ? `${happyClientsCount}+` : '0',
          label: 'Happy Clients'
        },
        {
          icon: 'Building', 
          number: industriesCount > 0 ? `${industriesCount}+` : '1+',
          label: 'Industries Served'
        },
        {
          icon: 'Globe',
          number: `${countriesCount}+`, 
          label: 'Countries'
        },
        {
          icon: 'TrendingUp',
          number: `${successRate}%`,
          label: 'Success Rate'
        }
      ];

      return statistics;

    } catch (error: unknown) {
      console.error('❌ Error calculating real-time statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to calculate statistics: ${errorMessage}`);
    }
  }

  // Method untuk save ke database
  async saveStatisticsToDatabase(): Promise<StatisticResult[]> {
    try {
      const realTimeStats = await this.getStatisticsRealTime();
      
      // Cara 1: Cari berdasarkan label, lalu update atau create
      for (let i = 0; i < realTimeStats.length; i++) {
        const stat = realTimeStats[i];
        
        // Cari existing statistic berdasarkan label
        const existingStat = await prisma.statistic.findFirst({
          where: { label: stat.label }
        });

        if (existingStat) {
          // Update jika sudah ada
          await prisma.statistic.update({
            where: { id: existingStat.id },
            data: {
              number: stat.number,
              icon: stat.icon,
              order: i + 1,
              isActive: true
            }
          });
        } else {
          // Create jika belum ada
          await prisma.statistic.create({
            data: {
              ...stat,
              order: i + 1,
              isActive: true
            }
          });
        }
      }

      return realTimeStats;

    } catch (error: unknown) {
      console.error('❌ Error saving statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to save statistics: ${errorMessage}`);
    }
  }

  // Method untuk get dari database
  async getStoredStatistics(): Promise<StatisticResult[]> {
    try {
      const stored = await prisma.statistic.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: {
          icon: true,
          number: true,
          label: true
        }
      });

      return stored;
    } catch (error: unknown) {
      console.error('❌ Error getting stored statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get stored statistics: ${errorMessage}`);
    }
  }

  // ======= MISSING METHODS UNTUK CONTROLLER =======

  // GET ALL with pagination and filtering
  async getAllStatistics(options: QueryOptions) {
    try {
      const statistics = await prisma.statistic.findMany({
        where: options.where || {},
        skip: options.skip || 0,
        take: options.take || 10,
        orderBy: options.orderBy || { order: 'asc' }
      });

      return statistics;
    } catch (error: unknown) {
      console.error('❌ Error getting all statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get statistics: ${errorMessage}`);
    }
  }

  // GET COUNT for pagination
  async getStatisticsCount(where?: any): Promise<number> {
    try {
      const count = await prisma.statistic.count({
        where: where || {}
      });
      return count;
    } catch (error: unknown) {
      console.error('❌ Error counting statistics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to count statistics: ${errorMessage}`);
    }
  }

  // GET BY ID
  async getStatisticById(id: number) {
    try {
      const statistic = await prisma.statistic.findUnique({
        where: { id }
      });

      if (!statistic) {
        throw new Error(`Statistic with ID ${id} not found`);
      }

      return statistic;
    } catch (error: unknown) {
      console.error('❌ Error getting statistic by ID:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get statistic: ${errorMessage}`);
    }
  }

  // CREATE
  async createStatistic(data: StatisticCreateData) {
    try {
      // Check if label already exists
      const existingStatistic = await prisma.statistic.findFirst({
        where: { label: data.label }
      });

      if (existingStatistic) {
        throw new Error(`Statistic with label "${data.label}" already exists`);
      }

      const statistic = await prisma.statistic.create({
        data: {
          icon: data.icon,
          number: data.number,
          label: data.label,
          order: data.order,
          isActive: data.isActive
        }
      });

      return statistic;
    } catch (error: unknown) {
      console.error('❌ Error creating statistic:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create statistic: ${errorMessage}`);
    }
  }

  // UPDATE
  async updateStatistic(id: number, data: StatisticUpdateData) {
    try {
      // Check if statistic exists
      const existingStatistic = await prisma.statistic.findUnique({
        where: { id }
      });

      if (!existingStatistic) {
        throw new Error(`Statistic with ID ${id} not found`);
      }

      // Check if label already exists (if updating label)
      if (data.label && data.label !== existingStatistic.label) {
        const labelExists = await prisma.statistic.findFirst({
          where: { 
            label: data.label,
            id: { not: id }
          }
        });

        if (labelExists) {
          throw new Error(`Statistic with label "${data.label}" already exists`);
        }
      }

      const statistic = await prisma.statistic.update({
        where: { id },
        data: data
      });

      return statistic;
    } catch (error: unknown) {
      console.error('❌ Error updating statistic:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update statistic: ${errorMessage}`);
    }
  }

  // DELETE
  async deleteStatistic(id: number) {
    try {
      // Check if statistic exists
      const existingStatistic = await prisma.statistic.findUnique({
        where: { id }
      });

      if (!existingStatistic) {
        throw new Error(`Statistic with ID ${id} not found`);
      }

      await prisma.statistic.delete({
        where: { id }
      });

      return {
        message: `Statistic "${existingStatistic.label}" deleted successfully`
      };
    } catch (error: unknown) {
      console.error('❌ Error deleting statistic:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete statistic: ${errorMessage}`);
    }
  }

  // Method untuk debugging
  async debugDatabaseContent(): Promise<DebugResult> {
    try {
      const [clients, testimonials, statistics] = await Promise.all([
        prisma.client.findMany({
          select: {
            id: true,
            name: true,
            industry: true,
            isActive: true
          }
        }),
        prisma.testimonial.findMany({
          select: {
            id: true,
            rating: true,
            author: true,
            client: {
              select: { name: true, isActive: true }
            }
          }
        }),
        prisma.statistic.findMany()
      ]);

      return {
        clients: {
          total: clients.length,
          active: clients.filter(c => c.isActive).length,
          industries: [...new Set(clients.filter(c => c.isActive).map(c => c.industry))],
          data: clients
        },
        testimonials: {
          total: testimonials.length,
          withRating: testimonials.filter(t => t.rating !== null).length,
          data: testimonials
        },
        statistics: {
          total: statistics.length,
          data: statistics
        }
      };
    } catch (error: unknown) {
      console.error('❌ Error debugging database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to debug database: ${errorMessage}`);
    }
  }
}

export default new StatisticService();