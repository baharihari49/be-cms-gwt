// schemas/clientSchema.ts
import { z } from 'zod';

// ID validation schema
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be greater than 0')
});

// Pagination schema
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

// Client Schemas
export const createClientSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Client name must be at least 2 characters long')
      .max(100, 'Client name must not exceed 100 characters')
      .trim(),
    industry: z
      .string()
      .min(2, 'Industry must be at least 2 characters long')
      .max(50, 'Industry must not exceed 50 characters')
      .trim(),
    image: z
      .string()
      .url('Image must be a valid URL')
      .optional()
      .nullable()
      .or(z.literal('')),
    isActive: z
      .boolean()
      .optional()
  })
});

export const updateClientSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: z
      .string()
      .min(2, 'Client name must be at least 2 characters long')
      .max(100, 'Client name must not exceed 100 characters')
      .trim()
      .optional(),
    industry: z
      .string()
      .min(2, 'Industry must be at least 2 characters long')
      .max(50, 'Industry must not exceed 50 characters')
      .trim()
      .optional(),
    image: z
      .string()
      .url('Image must be a valid URL')
      .optional()
      .nullable()
      .or(z.literal('')),
    isActive: z
      .boolean()
      .optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getClientByIdSchema = z.object({
  params: idParamSchema
});

export const deleteClientSchema = z.object({
  params: idParamSchema
});

export const getAllClientsSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val) return true;
          const [field, order] = val.split(':');
          return ['id', 'name', 'industry', 'createdAt'].includes(field) && 
                 ['asc', 'desc'].includes(order);
        },
        'Sort format must be field:order (e.g., name:asc). Valid fields: id, name, industry, createdAt'
      ),
    industry: z.string().optional(),
    isActive: z
      .string()
      .optional()
      .transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
  })
});

export const searchClientSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(2, 'Search query must be at least 2 characters long')
      .max(100, 'Search query must not exceed 100 characters')
      .trim(),
    ...paginationSchema.shape,
    sort: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val) return true;
          const [field, order] = val.split(':');
          return ['id', 'name', 'industry', 'createdAt'].includes(field) && 
                 ['asc', 'desc'].includes(order);
        },
        'Sort format must be field:order (e.g., name:asc). Valid fields: id, name, industry, createdAt'
      )
  })
});

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};