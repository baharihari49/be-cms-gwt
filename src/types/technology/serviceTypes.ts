// types/service.types.ts

// Service method return types
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Service options for queries
export interface ServiceQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: any;
  include?: {
    [key: string]: boolean;
  };
}

// Service search options
export interface ServiceSearchOptions extends ServiceQueryOptions {
  searchTerm: string;
}

// Service pagination result
export interface ServicePaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Service error types
export type ServiceErrorType = 
  | 'NOT_FOUND'
  | 'DUPLICATE_ENTRY'
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR'
  | 'CONSTRAINT_ERROR';

export interface ServiceError {
  type: ServiceErrorType;
  message: string;
  details?: any;
}

// Service method signatures
export interface ITechnologyService {
  getAllTechnologies(options?: ServiceQueryOptions): Promise<any[]>;
  getTechnologyById(id: number, include?: any): Promise<any>;
  getTechnologyByName(name: string, include?: any): Promise<any>;
  createTechnology(data: any): Promise<any>;
  updateTechnology(id: number, data: any): Promise<any>;
  deleteTechnology(id: number): Promise<{ message: string }>;
  searchTechnologies(query: string, options?: ServiceQueryOptions): Promise<any[]>;
  getTechnologiesCount(): Promise<number>;
  getSearchCount(query: string): Promise<number>;
}