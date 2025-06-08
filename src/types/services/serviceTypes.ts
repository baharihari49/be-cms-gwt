// types/service/serviceTypes.ts
export interface Service {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceFeature {
  id: number;
  name: string;
  serviceId: number;
  service?: Service;
}

export interface ServiceTechnology {
  id: number;
  name: string;
  serviceId: number;
  technologyId: number;
  technology?: Technology;
  service?: Service;
}

export interface Technology {
  id: number;
  name: string;
  icon?: string | null;
  description?: string | null;
}

export interface ServiceWithRelations extends Service {
  features?: ServiceFeature[];
  technologies?: ServiceTechnology[];
}

export interface ServiceCreateInput {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  features?: string[];
  technologyIds?: number[];
}

export interface ServiceUpdateInput {
  icon?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  color?: string;
  features?: string[];
  technologyIds?: number[];
}

export interface IncludeOptions {
  features?: boolean;
  technologies?: boolean;
}

export interface ServiceQueryOptions {
  include?: IncludeOptions;
  skip?: number;
  take?: number;
  orderBy?: any;
}

// Response types
export interface ServiceResponse {
  success: boolean;
  data: ServiceWithRelations;
  message?: string;
}

export interface ServicesResponse {
  success: boolean;
  data: ServiceWithRelations[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ServiceSearchResponse {
  success: boolean;
  data: ServiceWithRelations[];
  query: string;
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