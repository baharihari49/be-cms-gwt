// types/aboutUs/serviceTypes.ts
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
} from './aboutUsTypes';

// Company Value Service Interface
export interface ICompanyValueService {
  getAllCompanyValues(options?: AboutUsQueryOptions): Promise<CompanyValue[]>;
  getCompanyValueById(id: string): Promise<CompanyValue>;
  createCompanyValue(data: CompanyValueCreateInput): Promise<CompanyValue>;
  updateCompanyValue(id: string, data: CompanyValueUpdateInput): Promise<CompanyValue>;
  deleteCompanyValue(id: string): Promise<{ message: string }>;
  getCompanyValuesCount(): Promise<number>;
}

// Timeline Item Service Interface
export interface ITimelineItemService {
  getAllTimelineItems(options?: AboutUsQueryOptions): Promise<TimelineItem[]>;
  getTimelineItemById(id: string): Promise<TimelineItem>;
  createTimelineItem(data: TimelineItemCreateInput): Promise<TimelineItem>;
  updateTimelineItem(id: string, data: TimelineItemUpdateInput): Promise<TimelineItem>;
  deleteTimelineItem(id: string): Promise<{ message: string }>;
  getTimelineItemsCount(): Promise<number>;
}

// Company Stat Service Interface
export interface ICompanyStatService {
  getAllCompanyStats(options?: AboutUsQueryOptions): Promise<CompanyStat[]>;
  getCompanyStatById(id: string): Promise<CompanyStat>;
  createCompanyStat(data: CompanyStatCreateInput): Promise<CompanyStat>;
  updateCompanyStat(id: string, data: CompanyStatUpdateInput): Promise<CompanyStat>;
  deleteCompanyStat(id: string): Promise<{ message: string }>;
  getCompanyStatsCount(): Promise<number>;
}

// Company Info Service Interface
export interface ICompanyInfoService {
  getAllCompanyInfo(options?: AboutUsQueryOptions): Promise<CompanyInfo[]>;
  getCompanyInfoById(id: string): Promise<CompanyInfo>;
  createCompanyInfo(data: CompanyInfoCreateInput): Promise<CompanyInfo>;
  updateCompanyInfo(id: string, data: CompanyInfoUpdateInput): Promise<CompanyInfo>;
  deleteCompanyInfo(id: string): Promise<{ message: string }>;
  getCompanyInfoCount(): Promise<number>;
  getMainCompanyInfo(): Promise<CompanyInfo | null>;
}

// Main About Us Service Interface
export interface IAboutUsService {
  getCompleteAboutUsData(): Promise<CompleteAboutUsData>;
}