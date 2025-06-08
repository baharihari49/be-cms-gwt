// schemas/statisticSchema.ts
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

// Statistic Schemas
export const createStatisticSchema = z.object({
  body: z.object({
    icon: z
      .string()
      .min(2, 'Icon must be at least 2 characters long')
      .max(50, 'Icon must not exceed 50 characters')
      .trim(),
    number: z
      .string()
      .min(1, 'Number must be at least 1 character long')
      .max(20, 'Number must not exceed 20 characters')
      .trim(),
    label: z
      .string()
      .min(2, 'Label must be at least 2 characters long')
      .max(100, 'Label must not exceed 100 characters')
      .trim(),
    order: z
      .number()
      .int()
      .min(0, 'Order must be at least 0')
      .optional(),
    isActive: z
      .boolean()
      .optional()
  })
});

export const updateStatisticSchema = z.object({
  params: idParamSchema,
  body: z.object({
    icon: z
      .string()
      .min(2, 'Icon must be at least 2 characters long')
      .max(50, 'Icon must not exceed 50 characters')
      .trim()
      .optional(),
    number: z
      .string()
      .min(1, 'Number must be at least 1 character long')
      .max(20, 'Number must not exceed 20 characters')
      .trim()
      .optional(),
    label: z
      .string()
      .min(2, 'Label must be at least 2 characters long')
      .max(100, 'Label must not exceed 100 characters')
      .trim()
      .optional(),
    order: z
      .number()
      .int()
      .min(0, 'Order must be at least 0')
      .optional(),
    isActive: z
      .boolean()
      .optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getStatisticByIdSchema = z.object({
  params: idParamSchema
});

export const deleteStatisticSchema = z.object({
  params: idParamSchema
});

export const getAllStatisticsSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val) return true;
          const [field, order] = val.split(':');
          return ['id', 'label', 'order', 'createdAt'].includes(field) && 
                 ['asc', 'desc'].includes(order);
        },
        'Sort format must be field:order (e.g., order:asc). Valid fields: id, label, order, createdAt'
      ),
    isActive: z
      .string()
      .optional()
      .transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
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