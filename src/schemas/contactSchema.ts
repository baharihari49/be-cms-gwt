// schemas/contactSchema.ts
import { z } from 'zod';

// Base schemas
export const contactTitleSchema = z
  .string()
  .min(2, 'Contact title must be at least 2 characters long')
  .max(100, 'Contact title must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Contact title cannot be empty');

export const contactDetailsSchema = z
  .array(z.string().min(1, 'Detail cannot be empty'))
  .min(1, 'At least one detail is required')
  .max(10, 'Maximum 10 details allowed');

export const contactColorSchema = z
  .string()
  .min(1, 'Color is required')
  .max(100, 'Color must not exceed 100 characters');

export const contactHrefSchema = z
  .string()
  .max(500, 'Href must not exceed 500 characters')
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

// Contact CRUD schemas
export const createContactSchema = z.object({
  body: z.object({
    title: contactTitleSchema,
    details: contactDetailsSchema,
    color: contactColorSchema,
    href: contactHrefSchema
  })
});

export const updateContactSchema = z.object({
  params: idParamSchema,
  body: z.object({
    title: contactTitleSchema.optional(),
    details: contactDetailsSchema.optional(),
    color: contactColorSchema.optional(),
    href: contactHrefSchema
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getContactByIdSchema = z.object({
  params: idParamSchema
});

export const deleteContactSchema = z.object({
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
      return ['id', 'title', 'createdAt'].includes(field) && 
             ['asc', 'desc'].includes(order);
    },
    'Sort format must be field:order (e.g., title:asc). Valid fields: id, title, createdAt'
  );

// Search schema
export const searchContactSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(2, 'Search query must be at least 2 characters long')
      .max(100, 'Search query must not exceed 100 characters')
      .trim(),
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

// Get all contacts schema
export const getAllContactsSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

// Type inference from schemas
export type CreateContactInput = z.infer<typeof createContactSchema>['body'];
export type UpdateContactInput = z.infer<typeof updateContactSchema>['body'];
export type ContactIdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchContactSchema>['query'];
export type GetAllQuery = z.infer<typeof getAllContactsSchema>['query'];

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validation functions
export const validateContactTitle = (title: string): boolean => {
  try {
    contactTitleSchema.parse(title);
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