// schemas/aboutUsSchema.ts
import { z } from 'zod';

// Base schemas
export const companyValueIconSchema = z
  .string()
  .min(1, 'Icon is required')
  .max(50, 'Icon name must not exceed 50 characters');

export const companyValueTitleSchema = z
  .string()
  .min(2, 'Title must be at least 2 characters long')
  .max(100, 'Title must not exceed 100 characters')
  .trim();

export const companyValueDescriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters long')
  .max(500, 'Description must not exceed 500 characters')
  .trim();

export const companyValueColorSchema = z
  .string()
  .min(1, 'Color gradient is required')
  .max(100, 'Color gradient must not exceed 100 characters');

export const timelineYearSchema = z
  .string()
  .min(4, 'Year must be at least 4 characters')
  .max(20, 'Year must not exceed 20 characters');

export const timelineTitleSchema = z
  .string()
  .min(2, 'Title must be at least 2 characters long')
  .max(100, 'Title must not exceed 100 characters')
  .trim();

export const timelineDescriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters long')
  .max(500, 'Description must not exceed 500 characters')
  .trim();

export const timelineAchievementSchema = z
  .string()
  .min(2, 'Achievement must be at least 2 characters long')
  .max(100, 'Achievement must not exceed 100 characters')
  .trim();

export const timelineExtendedDescriptionSchema = z
  .string()
  .min(20, 'Extended description must be at least 20 characters long')
  .max(1000, 'Extended description must not exceed 1000 characters')
  .trim();

export const companyStatIconSchema = z
  .string()
  .min(1, 'Icon is required')
  .max(50, 'Icon name must not exceed 50 characters');

export const companyStatNumberSchema = z
  .string()
  .min(1, 'Number is required')
  .max(20, 'Number must not exceed 20 characters');

export const companyStatLabelSchema = z
  .string()
  .min(2, 'Label must be at least 2 characters long')
  .max(100, 'Label must not exceed 100 characters')
  .trim();

// ID validation schemas
export const idParamSchema = z.object({
  id: z
    .string()
    .min(1, 'ID is required')
    .refine(val => val.length > 0, 'ID cannot be empty')
});

// Company Value CRUD schemas
export const createCompanyValueSchema = z.object({
  body: z.object({
    icon: companyValueIconSchema,
    title: companyValueTitleSchema,
    description: companyValueDescriptionSchema,
    color: companyValueColorSchema,
    order: z.number().min(0).optional()
  })
});

export const updateCompanyValueSchema = z.object({
  params: idParamSchema,
  body: z.object({
    icon: companyValueIconSchema.optional(),
    title: companyValueTitleSchema.optional(),
    description: companyValueDescriptionSchema.optional(),
    color: companyValueColorSchema.optional(),
    order: z.number().min(0).optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getCompanyValueByIdSchema = z.object({
  params: idParamSchema
});

export const deleteCompanyValueSchema = z.object({
  params: idParamSchema
});

// Timeline Item CRUD schemas
export const createTimelineItemSchema = z.object({
  body: z.object({
    year: timelineYearSchema,
    title: timelineTitleSchema,
    description: timelineDescriptionSchema,
    achievement: timelineAchievementSchema,
    extendedDescription: timelineExtendedDescriptionSchema,
    order: z.number().min(0).optional()
  })
});

export const updateTimelineItemSchema = z.object({
  params: idParamSchema,
  body: z.object({
    year: timelineYearSchema.optional(),
    title: timelineTitleSchema.optional(),
    description: timelineDescriptionSchema.optional(),
    achievement: timelineAchievementSchema.optional(),
    extendedDescription: timelineExtendedDescriptionSchema.optional(),
    order: z.number().min(0).optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getTimelineItemByIdSchema = z.object({
  params: idParamSchema
});

export const deleteTimelineItemSchema = z.object({
  params: idParamSchema
});

// Company Stat CRUD schemas
export const createCompanyStatSchema = z.object({
  body: z.object({
    icon: companyStatIconSchema,
    number: companyStatNumberSchema,
    label: companyStatLabelSchema,
    order: z.number().min(0).optional()
  })
});

export const updateCompanyStatSchema = z.object({
  params: idParamSchema,
  body: z.object({
    icon: companyStatIconSchema.optional(),
    number: companyStatNumberSchema.optional(),
    label: companyStatLabelSchema.optional(),
    order: z.number().min(0).optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getCompanyStatByIdSchema = z.object({
  params: idParamSchema
});

export const deleteCompanyStatSchema = z.object({
  params: idParamSchema
});

// Company Info CRUD schemas
export const createCompanyInfoSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, 'Company name is required').max(100),
    previousName: z.string().max(100).optional(),
    foundedYear: z.string().max(4),
    mission: z.string().min(10, 'Mission must be at least 10 characters').max(2000),
    vision: z.string().min(10, 'Vision must be at least 10 characters').max(2000),
    aboutHeader: z.string().min(10, 'About header must be at least 10 characters').max(200),
    aboutSubheader: z.string().min(10, 'About subheader must be at least 10 characters').max(500),
    journeyTitle: z.string().max(100).optional(),
    storyText: z.string().min(50, 'Story text must be at least 50 characters').max(5000),
    heroImageUrl: z.string().url('Must be a valid URL').optional().nullable()
  })
});

export const updateCompanyInfoSchema = z.object({
  params: idParamSchema,
  body: z.object({
    companyName: z.string().min(1).max(100).optional(),
    previousName: z.string().max(100).optional(),
    foundedYear: z.string().max(4).optional(),
    mission: z.string().min(10).max(2000).optional(),
    vision: z.string().min(10).max(2000).optional(),
    aboutHeader: z.string().min(10).max(200).optional(),
    aboutSubheader: z.string().min(10).max(500).optional(),
    journeyTitle: z.string().max(100).optional(),
    storyText: z.string().min(50).max(5000).optional(),
    heroImageUrl: z.string().url().optional().nullable()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getCompanyInfoByIdSchema = z.object({
  params: idParamSchema
});

export const deleteCompanyInfoSchema = z.object({
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
      return ['id', 'order', 'createdAt'].includes(field) && 
             ['asc', 'desc'].includes(order);
    },
    'Sort format must be field:order (e.g., order:asc). Valid fields: id, order, createdAt'
  );

// Get all schemas
export const getAllCompanyValuesSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

export const getAllTimelineItemsSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

export const getAllCompanyStatsSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

export const getAllCompanyInfoSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

// Type inference from schemas
export type CreateCompanyValueInput = z.infer<typeof createCompanyValueSchema>['body'];
export type UpdateCompanyValueInput = z.infer<typeof updateCompanyValueSchema>['body'];
export type CreateTimelineItemInput = z.infer<typeof createTimelineItemSchema>['body'];
export type UpdateTimelineItemInput = z.infer<typeof updateTimelineItemSchema>['body'];
export type CreateCompanyStatInput = z.infer<typeof createCompanyStatSchema>['body'];
export type UpdateCompanyStatInput = z.infer<typeof updateCompanyStatSchema>['body'];
export type CreateCompanyInfoInput = z.infer<typeof createCompanyInfoSchema>['body'];
export type UpdateCompanyInfoInput = z.infer<typeof updateCompanyInfoSchema>['body'];
export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validation functions
export const validateId = (id: string): boolean => {
  try {
    return Boolean(id && id.length > 0);
  } catch {
    return false;
  }
};