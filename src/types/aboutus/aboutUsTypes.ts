// types/aboutUs/aboutUsTypes.ts
import { Request } from 'express';

// Database model types
export interface CompanyValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  achievement: string;
  extendedDescription: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyStat {
  id: string;
  icon: string;
  number: string;
  label: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyInfo {
  id: string;
  companyName: string;
  previousName: string;
  foundedYear: string;
  mission: string;
  vision: string;
  aboutHeader: string;
  aboutSubheader: string;
  journeyTitle: string;
  storyText: string;
  heroImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for creating and updating
export interface CompanyValueCreateInput {
  icon: string;
  title: string;
  description: string;
  color: string;
  order?: number;
}

export interface CompanyValueUpdateInput {
  icon?: string;
  title?: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface TimelineItemCreateInput {
  year: string;
  title: string;
  description: string;
  achievement: string;
  extendedDescription: string;
  order?: number;
}

export interface TimelineItemUpdateInput {
  year?: string;
  title?: string;
  description?: string;
  achievement?: string;
  extendedDescription?: string;
  order?: number;
}

export interface CompanyStatCreateInput {
  icon: string;
  number: string;
  label: string;
  order?: number;
}

export interface CompanyStatUpdateInput {
  icon?: string;
  number?: string;
  label?: string;
  order?: number;
}

export interface CompanyInfoCreateInput {
  companyName: string;
  previousName?: string;
  foundedYear: string;
  mission: string;
  vision: string;
  aboutHeader: string;
  aboutSubheader: string;
  journeyTitle?: string;
  storyText: string;
  heroImageUrl?: string | null;
}

export interface CompanyInfoUpdateInput {
  companyName?: string;
  previousName?: string;
  foundedYear?: string;
  mission?: string;
  vision?: string;
  aboutHeader?: string;
  aboutSubheader?: string;
  journeyTitle?: string;
  storyText?: string;
  heroImageUrl?: string | null;
}

// Query options for database operations
export interface AboutUsQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
}

// Response types
export interface AboutUsResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AboutUsPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

// Complete About Us data structure
export interface CompleteAboutUsData {
  companyInfo: CompanyInfo | null;
  companyValues: CompanyValue[];
  timelineItems: TimelineItem[];
  companyStats: CompanyStat[];
}

// Request types
export interface AboutUsRequest extends Request {
  params: {
    id?: string;
  };
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

// Company Value request types
export interface GetCompanyValueByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateCompanyValueRequest extends Request {
  body: CompanyValueCreateInput;
}

export interface UpdateCompanyValueRequest extends Request {
  params: {
    id: string;
  };
  body: CompanyValueUpdateInput;
}

export interface DeleteCompanyValueRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetAllCompanyValuesRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

// Timeline Item request types
export interface GetTimelineItemByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateTimelineItemRequest extends Request {
  body: TimelineItemCreateInput;
}

export interface UpdateTimelineItemRequest extends Request {
  params: {
    id: string;
  };
  body: TimelineItemUpdateInput;
}

export interface DeleteTimelineItemRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetAllTimelineItemsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

// Company Stat request types
export interface GetCompanyStatByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateCompanyStatRequest extends Request {
  body: CompanyStatCreateInput;
}

export interface UpdateCompanyStatRequest extends Request {
  params: {
    id: string;
  };
  body: CompanyStatUpdateInput;
}

export interface DeleteCompanyStatRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetAllCompanyStatsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

// Company Info request types
export interface GetCompanyInfoByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateCompanyInfoRequest extends Request {
  body: CompanyInfoCreateInput;
}

export interface UpdateCompanyInfoRequest extends Request {
  params: {
    id: string;
  };
  body: CompanyInfoUpdateInput;
}

export interface DeleteCompanyInfoRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetAllCompanyInfoRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

export interface GetCompleteAboutUsRequest extends Request {
  // No specific params or query needed for complete data
}