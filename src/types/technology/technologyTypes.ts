// types/technology.types.ts
import { Technology as PrismaTechnology, Prisma } from '@prisma/client';

// Base Technology interface from Prisma
export interface Technology extends PrismaTechnology {}

// Technology with relations
export interface TechnologyWithRelations extends Technology {
  projects?: ProjectTechnology[];
  services?: ServiceTechnology[];
}

// Input types for creating technology
export interface TechnologyCreateInput {
  name: string;
  icon?: string | null;
  description?: string | null;
}

// Input types for updating technology
export interface TechnologyUpdateInput {
  name?: string;
  icon?: string | null;
  description?: string | null;
}

// Query options for fetching technologies
export interface TechnologyQueryOptions {
  include?: {
    projects?: boolean;
    services?: boolean;
  };
  skip?: number;
  take?: number;
  orderBy?: Prisma.TechnologyOrderByWithRelationInput;
}

// Search options
export interface TechnologySearchOptions extends TechnologyQueryOptions {
  query: string;
}

// Pagination interface
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Sorting interface
export interface SortOptions {
  field?: 'id' | 'name' | 'createdAt';
  order?: 'asc' | 'desc';
}

// Include options for relations
export interface IncludeOptions {
  projects?: boolean;
  services?: boolean;
}

// Relations interfaces (adjust based on your actual models)
export interface ProjectTechnology {
  id: number;
  projectId: number;
  technologyId: number;
  createdAt?: Date;
  updatedAt?: Date;
  project?: {
    id: number;
    name: string;
    // Add other project fields as needed
  };
  technology?: Technology;
}

export interface ServiceTechnology {
  id: number;
  serviceId: number;
  technologyId: number;
  createdAt?: Date;
  updatedAt?: Date;
  service?: {
    id: number;
    name: string;
    // Add other service fields as needed
  };
  technology?: Technology;
}

// Response types
export interface TechnologyResponse {
  success: boolean;
  data?: Technology | TechnologyWithRelations;
  message?: string;
}

export interface TechnologiesResponse {
  success: boolean;
  data?: Technology[] | TechnologyWithRelations[];
  pagination?: PaginationInfo;
  message?: string;
}

export interface TechnologySearchResponse extends TechnologiesResponse {
  query?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Error response interface
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

// Generic API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
  query?: string;
  errors?: string[];
}