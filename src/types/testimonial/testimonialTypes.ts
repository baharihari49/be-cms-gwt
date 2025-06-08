// types/testimonial/testimonialTypes.ts

export interface Testimonial {
  id: number;
  projectId?: number | null;
  project?: {
    id: number;
    title: string;
  } | null;
  clientId?: number | null;
  client?: {
    id: number;
    name: string;
  } | null;
  author: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating?: number | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialCreateInput {
  projectId?: number | null;
  clientId?: number | null;
  author: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating?: number | null;
  avatar?: string | null;
}

export interface TestimonialUpdateInput {
  projectId?: number | null;
  clientId?: number | null;
  author?: string;
  role?: string | null;
  company?: string | null;
  content?: string;
  rating?: number | null;
  avatar?: string | null;
}

export interface TestimonialQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  projectId?: number;
  clientId?: number;
}

export interface TestimonialFilters {
  projectId?: number;
  clientId?: number;
  minRating?: number;
  maxRating?: number;
  search?: string;
}

export interface TestimonialStats {
  total: number;
  withProjects: number;
  withClients: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
}