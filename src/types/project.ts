// types/project.ts
import { ProjectStatus, ImageType } from '../constants/project';

export interface ProjectImage {
  id: number;
  url: string;
  caption?: string;
  order: number;
  type: ImageType;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectReview {
  id: number;
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMetrics {
  id: number;
  users?: string;
  performance?: string;
  rating?: string;
  downloads?: string;
  revenue?: string;
  uptime?: string;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLinks {
  id: number;
  live?: string;
  github?: string;
  case?: string;
  demo?: string;
  docs?: string;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  label: string;
  value: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technology {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  categoryId: string;
  type: string;
  description: string;
  image?: string;
  client?: string;
  duration?: string;
  year?: string;
  status: ProjectStatus;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  category: Category;
  technologies?: string[];
  features?: string[];
  metrics?: ProjectMetrics;
  links?: ProjectLinks;
  images?: ProjectImage[];
  reviews?: ProjectReview[];
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: ProjectStatus;
  search?: string;
  sort?: 'createdAt' | 'title' | 'year';
  order?: 'asc' | 'desc';
}

export interface ProjectsPaginatedResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Input interfaces (tanpa id, createdAt, updatedAt, projectId)
export interface CreateProjectMetrics {
  users?: string;
  performance?: string;
  rating?: string;
  downloads?: string;
  revenue?: string;
  uptime?: string;
}

export interface CreateProjectLinks {
  live?: string;
  github?: string;
  case?: string;
  demo?: string;
  docs?: string;
}

export interface CreateProjectImage {
  url: string;
  caption?: string;
  order?: number;
  type?: ImageType;
}

export interface CreateProjectReview {
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
}

export interface CreateProjectRequest {
  title: string;
  subtitle: string;
  categoryId: string;
  type: string;
  description: string;
  image?: string;
  client?: string;
  duration?: string;
  year?: string;
  status?: ProjectStatus;
  icon?: string;
  color?: string;
  technologies?: string[];
  features?: string[];
  metrics?: CreateProjectMetrics;
  links?: CreateProjectLinks;
  images?: CreateProjectImage[];
  reviews?: CreateProjectReview[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface AddImageRequest {
  url: string;
  caption?: string;
  order?: number;
  type?: ImageType;
}

export interface AddReviewRequest {
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
}

export interface ProjectStatistics {
  totalProjects: number;
  projectsByStatus: {
    status: string;
    _count: number;
  }[];
  projectsByCategory: {
    categoryId: string;
    _count: number;
  }[];
  recentProjects: {
    id: number;
    title: string;
    createdAt: Date;
    status: string;
  }[];
}