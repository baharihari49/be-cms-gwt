// schemas/heroSchema.ts
import { z } from 'zod';

// Base schemas
export const welcomeTextSchema = z
  .string()
  .min(2, 'Welcome text must be at least 2 characters long')
  .max(100, 'Welcome text must not exceed 100 characters')
  .trim();

export const mainTitleSchema = z
  .string()
  .min(2, 'Main title must be at least 2 characters long')
  .max(100, 'Main title must not exceed 100 characters')
  .trim();

export const highlightTextSchema = z
  .string()
  .min(2, 'Highlight text must be at least 2 characters long')
  .max(100, 'Highlight text must not exceed 100 characters')
  .trim();

export const descriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters long')
  .max(1000, 'Description must not exceed 1000 characters')
  .trim();

export const logoSchema = z
  .string()
  .url('Logo must be a valid URL')
  .optional()
  .nullable()
  .or(z.literal(''));

export const imageSchema = z
  .string()
  .url('Image must be a valid URL')
  .optional()
  .nullable()
  .or(z.literal(''));

export const altTextSchema = z
  .string()
  .max(200, 'Alt text must not exceed 200 characters')
  .optional()
  .nullable()
  .or(z.literal(''));

export const socialMediaNameSchema = z
  .string()
  .min(2, 'Social media name must be at least 2 characters long')
  .max(50, 'Social media name must not exceed 50 characters')
  .trim();

export const socialMediaUrlSchema = z
  .string()
  .url('Social media URL must be a valid URL')
  .trim();

// ID validation schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});

// Hero Section CRUD schemas
export const createHeroSectionSchema = z.object({
  body: z.object({
    welcomeText: welcomeTextSchema,
    mainTitle: mainTitleSchema,
    highlightText: highlightTextSchema,
    description: descriptionSchema,
    logo: logoSchema,
    image: imageSchema,
    altText: altTextSchema,
    isActive: z.boolean().optional().default(true)
  })
});

export const updateHeroSectionSchema = z.object({
  params: idParamSchema,
  body: z.object({
    welcomeText: welcomeTextSchema.optional(),
    mainTitle: mainTitleSchema.optional(),
    highlightText: highlightTextSchema.optional(),
    description: descriptionSchema.optional(),
    logo: logoSchema,
    image: imageSchema,
    altText: altTextSchema,
    isActive: z.boolean().optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getHeroSectionSchema = z.object({
  query: z.object({
    include: z
      .string()
      .optional()
      .refine(
        val => !val || val.split(',').every(item => ['socialMedia'].includes(item.trim())),
        'Include parameter can only contain: socialMedia'
      )
  })
});

export const deleteHeroSectionSchema = z.object({
  params: idParamSchema
});

// Social Media CRUD schemas
export const createSocialMediaSchema = z.object({
  body: z.object({
    name: socialMediaNameSchema,
    url: socialMediaUrlSchema,
    isActive: z.boolean().optional().default(true),
    order: z.number().int().min(0).optional().default(0)
  })
});

export const updateSocialMediaSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: socialMediaNameSchema.optional(),
    url: socialMediaUrlSchema.optional(),
    isActive: z.boolean().optional(),
    order: z.number().int().min(0).optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const deleteSocialMediaSchema = z.object({
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
      return ['order', 'name', 'createdAt'].includes(field) && 
             ['asc', 'desc'].includes(order);
    },
    'Sort format must be field:order (e.g., order:asc). Valid fields: order, name, createdAt'
  );

export const getSocialMediaSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

// Type inference from schemas
export type CreateHeroSectionInput = z.infer<typeof createHeroSectionSchema>['body'];
export type UpdateHeroSectionInput = z.infer<typeof updateHeroSectionSchema>['body'];
export type CreateSocialMediaInput = z.infer<typeof createSocialMediaSchema>['body'];
export type UpdateSocialMediaInput = z.infer<typeof updateSocialMediaSchema>['body'];
export type HeroIdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type GetSocialMediaQuery = z.infer<typeof getSocialMediaSchema>['query'];

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validation functions
export const validateHeroId = (id: string): boolean => {
  try {
    idParamSchema.shape.id.parse(id);
    return true;
  } catch {
    return false;
  }
};

// Schema for database operations
export const dbCreateHeroSectionSchema = z.object({
  welcomeText: welcomeTextSchema,
  mainTitle: mainTitleSchema,
  highlightText: highlightTextSchema,
  description: descriptionSchema,
  logo: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  altText: z.string().nullable().optional(),
  isActive: z.boolean().optional()
});

export const dbUpdateHeroSectionSchema = z.object({
  welcomeText: welcomeTextSchema.optional(),
  mainTitle: mainTitleSchema.optional(),
  highlightText: highlightTextSchema.optional(),
  description: descriptionSchema.optional(),
  logo: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  altText: z.string().nullable().optional(),
  isActive: z.boolean().optional()
}).partial();

export type DbCreateHeroSectionInput = z.infer<typeof dbCreateHeroSectionSchema>;
export type DbUpdateHeroSectionInput = z.infer<typeof dbUpdateHeroSectionSchema>;