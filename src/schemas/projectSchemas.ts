// schemas/projectSchemas.ts
import { z } from 'zod';
import { PROJECT_STATUS, IMAGE_TYPES, SORT_FIELDS, SORT_ORDER } from '../constants/project';

// Base schemas
export const projectImageSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  order: z.number().optional(),
  type: z.enum([
    IMAGE_TYPES.SCREENSHOT,
    IMAGE_TYPES.MOCKUP,
    IMAGE_TYPES.LOGO,
    IMAGE_TYPES.DIAGRAM,
    IMAGE_TYPES.OTHER
  ]).optional()
});

export const projectReviewSchema = z.object({
  author: z.string().min(1),
  role: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().min(1).max(5).optional()
});

export const projectMetricsSchema = z.object({
  users: z.string().optional(),
  performance: z.string().optional(),
  rating: z.string().optional(),
  downloads: z.string().optional(),
  revenue: z.string().optional(),
  uptime: z.string().optional()
});

export const projectLinksSchema = z.object({
  live: z.string().url().optional(),
  github: z.string().url().optional(),
  case: z.string().optional(),
  demo: z.string().url().optional(),
  docs: z.string().url().optional()
});

// Main project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  categoryId: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  year: z.string().optional(),
  status: z.enum([
    PROJECT_STATUS.DEVELOPMENT,
    PROJECT_STATUS.BETA,
    PROJECT_STATUS.LIVE,
    PROJECT_STATUS.ARCHIVED,
    PROJECT_STATUS.MAINTENANCE
  ]).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  metrics: projectMetricsSchema.optional(),
  links: projectLinksSchema.optional(),
  images: z.array(projectImageSchema).optional(),
  reviews: z.array(projectReviewSchema).optional()
});

export const updateProjectSchema = createProjectSchema.partial();

export const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  category: z.string().optional(),
  status: z.enum([
    PROJECT_STATUS.DEVELOPMENT,
    PROJECT_STATUS.BETA,
    PROJECT_STATUS.LIVE,
    PROJECT_STATUS.ARCHIVED,
    PROJECT_STATUS.MAINTENANCE
  ]).optional(),
  search: z.string().optional(),
  sort: z.enum([
    SORT_FIELDS.CREATED_AT,
    SORT_FIELDS.TITLE,
    SORT_FIELDS.YEAR
  ]).optional(),
  order: z.enum([
    SORT_ORDER.ASC,
    SORT_ORDER.DESC
  ]).optional()
});

// Individual schemas for specific endpoints
export const addImageSchema = projectImageSchema;
export const addReviewSchema = projectReviewSchema;