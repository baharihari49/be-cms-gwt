// services/aboutUsServices.ts
import { PrismaClient } from '@prisma/client';
import {
  CompanyValue,
  TimelineItem,
  CompanyStat,
  CompanyInfo,
  CompanyValueCreateInput,
  CompanyValueUpdateInput,
  TimelineItemCreateInput,
  TimelineItemUpdateInput,
  CompanyStatCreateInput,
  CompanyStatUpdateInput,
  CompanyInfoCreateInput,
  CompanyInfoUpdateInput,
  AboutUsQueryOptions,
  CompleteAboutUsData
} from '../types/aboutus/aboutUsTypes';
import {
  ICompanyValueService,
  ITimelineItemService,
  ICompanyStatService,
  ICompanyInfoService,
  IAboutUsService
} from '../types/aboutus/serviceTypes';

const prisma = new PrismaClient();

// Company Value Service
class CompanyValueService implements ICompanyValueService {
  async getAllCompanyValues(options: AboutUsQueryOptions = {}): Promise<CompanyValue[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const companyValues = await prisma.companyValue.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { order: 'asc' }
      });
      
      return companyValues;
    } catch (error: any) {
      throw new Error(`Failed to fetch company values: ${error.message}`);
    }
  }

  async getCompanyValueById(id: string): Promise<CompanyValue> {
    try {
      const companyValue = await prisma.companyValue.findUnique({
        where: { id }
      });

      if (!companyValue) {
        throw new Error('Company value not found');
      }

      return companyValue;
    } catch (error: any) {
      throw new Error(`Failed to fetch company value: ${error.message}`);
    }
  }

  async createCompanyValue(data: CompanyValueCreateInput): Promise<CompanyValue> {
    try {
      const { icon, title, description, color, order } = data;

      // Validate required fields
      if (!icon || icon.trim() === '') {
        throw new Error('Icon is required');
      }
      if (!title || title.trim() === '') {
        throw new Error('Title is required');
      }

      const companyValue = await prisma.companyValue.create({
        data: {
          icon: icon.trim(),
          title: title.trim(),
          description: description.trim(),
          color: color.trim(),
          order: order || 0
        }
      });

      return companyValue;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Company value title already exists');
      }
      throw new Error(`Failed to create company value: ${error.message}`);
    }
  }

  async updateCompanyValue(id: string, data: CompanyValueUpdateInput): Promise<CompanyValue> {
    try {
      // Check if company value exists
      await this.getCompanyValueById(id);

      const updateData: any = {};
      if (data.icon !== undefined) updateData.icon = data.icon.trim();
      if (data.title !== undefined) updateData.title = data.title.trim();
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.color !== undefined) updateData.color = data.color.trim();
      if (data.order !== undefined) updateData.order = data.order;

      const updatedCompanyValue = await prisma.companyValue.update({
        where: { id },
        data: updateData
      });

      return updatedCompanyValue;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Company value title already exists');
      }
      throw new Error(`Failed to update company value: ${error.message}`);
    }
  }

  async deleteCompanyValue(id: string): Promise<{ message: string }> {
    try {
      // Check if company value exists
      await this.getCompanyValueById(id);

      await prisma.companyValue.delete({
        where: { id }
      });

      return { message: 'Company value deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete company value: ${error.message}`);
    }
  }

  async getCompanyValuesCount(): Promise<number> {
    try {
      const count = await prisma.companyValue.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count company values: ${error.message}`);
    }
  }
}

// Timeline Item Service
class TimelineItemService implements ITimelineItemService {
  async getAllTimelineItems(options: AboutUsQueryOptions = {}): Promise<TimelineItem[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const timelineItems = await prisma.timelineItem.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { order: 'asc' }
      });
      
      return timelineItems;
    } catch (error: any) {
      throw new Error(`Failed to fetch timeline items: ${error.message}`);
    }
  }

  async getTimelineItemById(id: string): Promise<TimelineItem> {
    try {
      const timelineItem = await prisma.timelineItem.findUnique({
        where: { id }
      });

      if (!timelineItem) {
        throw new Error('Timeline item not found');
      }

      return timelineItem;
    } catch (error: any) {
      throw new Error(`Failed to fetch timeline item: ${error.message}`);
    }
  }

  async createTimelineItem(data: TimelineItemCreateInput): Promise<TimelineItem> {
    try {
      const { year, title, description, achievement, extendedDescription, order } = data;

      const timelineItem = await prisma.timelineItem.create({
        data: {
          year: year.trim(),
          title: title.trim(),
          description: description.trim(),
          achievement: achievement.trim(),
          extendedDescription: extendedDescription.trim(),
          order: order || 0
        }
      });

      return timelineItem;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Timeline year already exists');
      }
      throw new Error(`Failed to create timeline item: ${error.message}`);
    }
  }

  async updateTimelineItem(id: string, data: TimelineItemUpdateInput): Promise<TimelineItem> {
    try {
      // Check if timeline item exists
      await this.getTimelineItemById(id);

      const updateData: any = {};
      if (data.year !== undefined) updateData.year = data.year.trim();
      if (data.title !== undefined) updateData.title = data.title.trim();
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.achievement !== undefined) updateData.achievement = data.achievement.trim();
      if (data.extendedDescription !== undefined) updateData.extendedDescription = data.extendedDescription.trim();
      if (data.order !== undefined) updateData.order = data.order;

      const updatedTimelineItem = await prisma.timelineItem.update({
        where: { id },
        data: updateData
      });

      return updatedTimelineItem;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Timeline year already exists');
      }
      throw new Error(`Failed to update timeline item: ${error.message}`);
    }
  }

  async deleteTimelineItem(id: string): Promise<{ message: string }> {
    try {
      // Check if timeline item exists
      await this.getTimelineItemById(id);

      await prisma.timelineItem.delete({
        where: { id }
      });

      return { message: 'Timeline item deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete timeline item: ${error.message}`);
    }
  }

  async getTimelineItemsCount(): Promise<number> {
    try {
      const count = await prisma.timelineItem.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count timeline items: ${error.message}`);
    }
  }
}

// Company Stat Service
class CompanyStatService implements ICompanyStatService {
  async getAllCompanyStats(options: AboutUsQueryOptions = {}): Promise<CompanyStat[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const companyStats = await prisma.companyStat.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { order: 'asc' }
      });
      
      return companyStats;
    } catch (error: any) {
      throw new Error(`Failed to fetch company stats: ${error.message}`);
    }
  }

  async getCompanyStatById(id: string): Promise<CompanyStat> {
    try {
      const companyStat = await prisma.companyStat.findUnique({
        where: { id }
      });

      if (!companyStat) {
        throw new Error('Company stat not found');
      }

      return companyStat;
    } catch (error: any) {
      throw new Error(`Failed to fetch company stat: ${error.message}`);
    }
  }

  async createCompanyStat(data: CompanyStatCreateInput): Promise<CompanyStat> {
    try {
      const { icon, number, label, order } = data;

      const companyStat = await prisma.companyStat.create({
        data: {
          icon: icon.trim(),
          number: number.trim(),
          label: label.trim(),
          order: order || 0
        }
      });

      return companyStat;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Company stat label already exists');
      }
      throw new Error(`Failed to create company stat: ${error.message}`);
    }
  }

  async updateCompanyStat(id: string, data: CompanyStatUpdateInput): Promise<CompanyStat> {
    try {
      // Check if company stat exists
      await this.getCompanyStatById(id);

      const updateData: any = {};
      if (data.icon !== undefined) updateData.icon = data.icon.trim();
      if (data.number !== undefined) updateData.number = data.number.trim();
      if (data.label !== undefined) updateData.label = data.label.trim();
      if (data.order !== undefined) updateData.order = data.order;

      const updatedCompanyStat = await prisma.companyStat.update({
        where: { id },
        data: updateData
      });

      return updatedCompanyStat;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Company stat label already exists');
      }
      throw new Error(`Failed to update company stat: ${error.message}`);
    }
  }

  async deleteCompanyStat(id: string): Promise<{ message: string }> {
    try {
      // Check if company stat exists
      await this.getCompanyStatById(id);

      await prisma.companyStat.delete({
        where: { id }
      });

      return { message: 'Company stat deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete company stat: ${error.message}`);
    }
  }

  async getCompanyStatsCount(): Promise<number> {
    try {
      const count = await prisma.companyStat.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count company stats: ${error.message}`);
    }
  }
}

// Company Info Service
class CompanyInfoService implements ICompanyInfoService {
  async getAllCompanyInfo(options: AboutUsQueryOptions = {}): Promise<CompanyInfo[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const companyInfo = await prisma.companyInfo.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { createdAt: 'desc' }
      });
      
      return companyInfo;
    } catch (error: any) {
      throw new Error(`Failed to fetch company info: ${error.message}`);
    }
  }

  async getCompanyInfoById(id: string): Promise<CompanyInfo> {
    try {
      const companyInfo = await prisma.companyInfo.findUnique({
        where: { id }
      });

      if (!companyInfo) {
        throw new Error('Company info not found');
      }

      return companyInfo;
    } catch (error: any) {
      throw new Error(`Failed to fetch company info: ${error.message}`);
    }
  }

  async createCompanyInfo(data: CompanyInfoCreateInput): Promise<CompanyInfo> {
    try {
      const companyInfo = await prisma.companyInfo.create({
        data: {
          companyName: data.companyName.trim(),
          previousName: data.previousName?.trim() || 'CIB Productions',
          foundedYear: data.foundedYear.trim(),
          mission: data.mission.trim(),
          vision: data.vision.trim(),
          aboutHeader: data.aboutHeader.trim(),
          aboutSubheader: data.aboutSubheader.trim(),
          journeyTitle: data.journeyTitle?.trim() || 'Our Journey',
          storyText: data.storyText.trim(),
          heroImageUrl: data.heroImageUrl || null
        }
      });

      return companyInfo;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Company name already exists');
      }
      throw new Error(`Failed to create company info: ${error.message}`);
    }
  }

  async updateCompanyInfo(id: string, data: CompanyInfoUpdateInput): Promise<CompanyInfo> {
    try {
      // Check if company info exists
      await this.getCompanyInfoById(id);

      const updateData: any = {};
      if (data.companyName !== undefined) updateData.companyName = data.companyName.trim();
      if (data.previousName !== undefined) updateData.previousName = data.previousName?.trim();
      if (data.foundedYear !== undefined) updateData.foundedYear = data.foundedYear.trim();
      if (data.mission !== undefined) updateData.mission = data.mission.trim();
      if (data.vision !== undefined) updateData.vision = data.vision.trim();
      if (data.aboutHeader !== undefined) updateData.aboutHeader = data.aboutHeader.trim();
      if (data.aboutSubheader !== undefined) updateData.aboutSubheader = data.aboutSubheader.trim();
      if (data.journeyTitle !== undefined) updateData.journeyTitle = data.journeyTitle?.trim();
      if (data.storyText !== undefined) updateData.storyText = data.storyText.trim();
      if (data.heroImageUrl !== undefined) updateData.heroImageUrl = data.heroImageUrl;

      const updatedCompanyInfo = await prisma.companyInfo.update({
        where: { id },
        data: updateData
      });

      return updatedCompanyInfo;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Company name already exists');
      }
      throw new Error(`Failed to update company info: ${error.message}`);
    }
  }

  async deleteCompanyInfo(id: string): Promise<{ message: string }> {
    try {
      // Check if company info exists
      await this.getCompanyInfoById(id);

      await prisma.companyInfo.delete({
        where: { id }
      });

      return { message: 'Company info deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete company info: ${error.message}`);
    }
  }

  async getCompanyInfoCount(): Promise<number> {
    try {
      const count = await prisma.companyInfo.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count company info: ${error.message}`);
    }
  }

  async getMainCompanyInfo(): Promise<CompanyInfo | null> {
    try {
      const companyInfo = await prisma.companyInfo.findFirst({
        orderBy: { createdAt: 'asc' }
      });

      return companyInfo;
    } catch (error: any) {
      throw new Error(`Failed to fetch main company info: ${error.message}`);
    }
  }
}

// Main About Us Service
class AboutUsService implements IAboutUsService {
  private companyValueService = new CompanyValueService();
  private timelineItemService = new TimelineItemService();
  private companyStatService = new CompanyStatService();
  private companyInfoService = new CompanyInfoService();

  async getCompleteAboutUsData(): Promise<CompleteAboutUsData> {
    try {
      const [companyInfo, companyValues, timelineItems, companyStats] = await Promise.all([
        this.companyInfoService.getMainCompanyInfo(),
        this.companyValueService.getAllCompanyValues({ orderBy: { order: 'asc' } }),
        this.timelineItemService.getAllTimelineItems({ orderBy: { order: 'asc' } }),
        this.companyStatService.getAllCompanyStats({ orderBy: { order: 'asc' } })
      ]);

      return {
        companyInfo,
        companyValues,
        timelineItems,
        companyStats
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch complete about us data: ${error.message}`);
    }
  }
}

// Export service instances
export const companyValueService = new CompanyValueService();
export const timelineItemService = new TimelineItemService();
export const companyStatService = new CompanyStatService();
export const companyInfoService = new CompanyInfoService();
export const aboutUsService = new AboutUsService();

export default {
  companyValueService,
  timelineItemService,
  companyStatService,
  companyInfoService,
  aboutUsService
};