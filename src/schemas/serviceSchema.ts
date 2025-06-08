// schemas/serviceSchema.ts
import { z } from 'zod';

// Base schemas
export const serviceIconSchema = z
  .string()
  .min(1, 'Icon is required')
  .max(100, 'Icon must not exceed 100 characters')
  .trim();

export const serviceTitleSchema = z
  .string()
  .min(2, 'Service title must be at least 2 characters long')
  .max(200, 'Service title must not exceed 200 characters')
  .trim()
  .refine(val => val.length > 0, 'Service title cannot be empty');

export const serviceSubtitleSchema = z
  .string()
  .min(2, 'Service subtitle must be at least 2 characters long')
  .max(300, 'Service subtitle must not exceed 300 characters')
  .trim()
  .refine(val => val.length > 0, 'Service subtitle cannot be empty');

export const serviceDescriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters long')
  .max(5000, 'Description must not exceed 5000 characters')
  .trim()
  .refine(val => val.length > 0, 'Description cannot be empty');

export const serviceColorSchema = z
  .string()
  .min(1, 'Color is required')
  .max(100, 'Color must not exceed 100 characters')
  .trim();

export const serviceFeaturesSchema = z
  .array(z.string().min(1, 'Feature name cannot be empty').max(200, 'Feature name must not exceed 200 characters'))
  .optional();

export const serviceTechnologyIdsSchema = z
  .array(z.number().int().positive('Technology ID must be a positive integer'))
  .optional();

// ID validation schemas
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be greater than 0')
});

export const titleParamSchema = z.object({
  title: z
    .string()
    .min(2, 'Service title must be at least 2 characters long')
    .max(200, 'Service title must not exceed 200 characters')
    .trim()
});

// Service CRUD schemas
export const createServiceSchema = z.object({
  body: z.object({
    icon: serviceIconSchema,
    title: serviceTitleSchema,
    subtitle: serviceSubtitleSchema,
    description: serviceDescriptionSchema,
    color: serviceColorSchema,
    features: serviceFeaturesSchema,
    technologyIds: serviceTechnologyIdsSchema
  })
});

export const updateServiceSchema = z.object({
  params: idParamSchema,
  body: z.object({
    icon: serviceIconSchema.optional(),
    title: serviceTitleSchema.optional(),
    subtitle: serviceSubtitleSchema.optional(),
    description: serviceDescriptionSchema.optional(),
    color: serviceColorSchema.optional(),
    features: serviceFeaturesSchema,
    technologyIds: serviceTechnologyIdsSchema
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getServiceByIdSchema = z.object({
  params: idParamSchema,
  query: z.object({
    include: z
      .string()
      .optional()
      .refine(
        val => !val || val.split(',').every(item => ['features', 'technologies'].includes(item.trim())),
        'Include parameter can only contain: features, technologies'
      )
  })
});

export const getServiceByTitleSchema = z.object({
  params: titleParamSchema,
  query: z.object({
    include: z
      .string()
      .optional()
      .refine(
        val => !val || val.split(',').every(item => ['features', 'technologies'].includes(item.trim())),
        'Include parameter can only contain: features, technologies'
      )
  })
});

export const deleteServiceSchema = z.object({
  params: idParamSchema
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return 1;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 1 : parsed;
    })
    .refine(val => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return 10;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 10 : parsed;
    })
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
});

export const sortSchema = z
  .string()
  .optional()
  .refine(
    val => {
      if (!val) return true;
      const [field, order] = val.split(':');
      return ['id', 'title', 'createdAt', 'updatedAt'].includes(field) && 
             ['asc', 'desc'].includes(order);
    },
    'Sort format must be field:order (e.g., title:asc). Valid fields: id, title, createdAt, updatedAt'
  );

export const includeSchema = z
  .string()
  .optional()
  .refine(
    val => !val || val.split(',').every(item => ['features', 'technologies'].includes(item.trim())),
    'Include parameter can only contain: features, technologies'
  );

// Search schema
export const searchServiceSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(2, 'Search query must be at least 2 characters long')
      .max(100, 'Search query must not exceed 100 characters')
      .trim(),
    ...paginationSchema.shape,
    sort: sortSchema,
    include: includeSchema
  })
});

// Get all services schema
export const getAllServicesSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema,
    include: includeSchema
  })
});

// Type inference from schemas
export type CreateServiceInput = z.infer<typeof createServiceSchema>['body'];
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>['body'];
export type ServiceIdParam = z.infer<typeof idParamSchema>;
export type ServiceTitleParam = z.infer<typeof titleParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchServiceSchema>['query'];
export type GetAllQuery = z.infer<typeof getAllServicesSchema>['query'];

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validation functions
export const validateServiceTitle = (title: string): boolean => {
  try {
    serviceTitleSchema.parse(title);
    return true;
  } catch {
    return false;
  }
};

export const validateId = (id: string): boolean => {
  try {
    idParamSchema.shape.id.parse(id);
    return true;
  } catch {
    return false;
  }
};

// Schema for database operations (without transformation)
export const dbCreateServiceSchema = z.object({
  icon: serviceIconSchema,
  title: serviceTitleSchema,
  subtitle: serviceSubtitleSchema,
  description: serviceDescriptionSchema,
  color: serviceColorSchema
});

export const dbUpdateServiceSchema = z.object({
  icon: serviceIconSchema.optional(),
  title: serviceTitleSchema.optional(),
  subtitle: serviceSubtitleSchema.optional(),
  description: serviceDescriptionSchema.optional(),
  color: serviceColorSchema.optional()
}).partial();

export type DbCreateServiceInput = z.infer<typeof dbCreateServiceSchema>;
export type DbUpdateServiceInput = z.infer<typeof dbUpdateServiceSchema>;