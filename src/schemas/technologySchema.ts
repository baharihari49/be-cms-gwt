// schemas/technology.schema.ts
import { z } from 'zod';

// Base schemas
export const technologyNameSchema = z
  .string()
  .min(2, 'Technology name must be at least 2 characters long')
  .max(100, 'Technology name must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Technology name cannot be empty');

export const technologyIconSchema = z
  .string()
  .max(255, 'Icon URL must not exceed 255 characters')
  .url('Icon must be a valid URL')
  .optional()
  .nullable()
  .or(z.literal(''));

export const technologyDescriptionSchema = z
  .string()
  .max(1000, 'Description must not exceed 1000 characters')
  .optional()
  .nullable()
  .or(z.literal(''));

// ID validation schemas
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be greater than 0')
});

export const nameParamSchema = z.object({
  name: z
    .string()
    .min(2, 'Technology name must be at least 2 characters long')
    .max(100, 'Technology name must not exceed 100 characters')
    .trim()
});

// Technology CRUD schemas
export const createTechnologySchema = z.object({
  body: z.object({
    name: technologyNameSchema,
    icon: technologyIconSchema,
    description: technologyDescriptionSchema
  })
});

export const updateTechnologySchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: technologyNameSchema.optional(),
    icon: technologyIconSchema,
    description: technologyDescriptionSchema
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getTechnologyByIdSchema = z.object({
  params: idParamSchema,
  query: z.object({
    include: z
      .string()
      .optional()
      .refine(
        val => !val || val.split(',').every(item => ['projects', 'services'].includes(item.trim())),
        'Include parameter can only contain: projects, services'
      )
  })
});

export const getTechnologyByNameSchema = z.object({
  params: nameParamSchema,
  query: z.object({
    include: z
      .string()
      .optional()
      .refine(
        val => !val || val.split(',').every(item => ['projects', 'services'].includes(item.trim())),
        'Include parameter can only contain: projects, services'
      )
  })
});

export const deleteTechnologySchema = z.object({
  params: idParamSchema
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => val ? parseInt(val, 10) : 1)
    .refine(val => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform(val => val ? parseInt(val, 10) : 10)
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
});

export const sortSchema = z
  .string()
  .optional()
  .refine(
    val => {
      if (!val) return true;
      const [field, order] = val.split(':');
      return ['id', 'name', 'createdAt'].includes(field) && 
             ['asc', 'desc'].includes(order);
    },
    'Sort format must be field:order (e.g., name:asc). Valid fields: id, name, createdAt'
  );

export const includeSchema = z
  .string()
  .optional()
  .refine(
    val => !val || val.split(',').every(item => ['projects', 'services'].includes(item.trim())),
    'Include parameter can only contain: projects, services'
  );

// Search schema
export const searchTechnologySchema = z.object({
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

// Get all technologies schema
export const getAllTechnologiesSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema,
    include: includeSchema
  })
});

// Type inference from schemas
export type CreateTechnologyInput = z.infer<typeof createTechnologySchema>['body'];
export type UpdateTechnologyInput = z.infer<typeof updateTechnologySchema>['body'];
export type TechnologyIdParam = z.infer<typeof idParamSchema>;
export type TechnologyNameParam = z.infer<typeof nameParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchTechnologySchema>['query'];
export type GetAllQuery = z.infer<typeof getAllTechnologiesSchema>['query'];

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validation functions
export const validateTechnologyName = (name: string): boolean => {
  try {
    technologyNameSchema.parse(name);
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
export const dbCreateTechnologySchema = z.object({
  name: technologyNameSchema,
  icon: z.string().nullable().optional(),
  description: z.string().nullable().optional()
});

export const dbUpdateTechnologySchema = z.object({
  name: technologyNameSchema.optional(),
  icon: z.string().nullable().optional(),
  description: z.string().nullable().optional()
}).partial();

export type DbCreateTechnologyInput = z.infer<typeof dbCreateTechnologySchema>;
export type DbUpdateTechnologyInput = z.infer<typeof dbUpdateTechnologySchema>;