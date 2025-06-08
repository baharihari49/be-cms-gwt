// schemas/testimonialSchema.ts
import { z } from 'zod';

// Base testimonial schema
export const testimonialBaseSchema = z.object({
  author: z.string().min(1, 'Author is required').max(255, 'Author name too long'),
  role: z.string().max(255, 'Role too long').optional().nullable(),
  company: z.string().max(255, 'Company name too long').optional().nullable(),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional().nullable(),
  avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  projectId: z.number().int().positive('Invalid project ID').optional().nullable(),
  clientId: z.number().int().positive('Invalid client ID').optional().nullable()
});

// Create testimonial schema
export const createTestimonialSchema = z.object({
  body: testimonialBaseSchema
});

// Update testimonial schema (all fields optional)
export const updateTestimonialSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid ID');
      return num;
    })
  }),
  body: testimonialBaseSchema.partial()
});

// Get testimonial by ID schema
export const getTestimonialByIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid ID');
      return num;
    })
  })
});

// Delete testimonial schema
export const deleteTestimonialSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid ID');
      return num;
    })
  })
});

// Get all testimonials schema
export const getAllTestimonialsSchema = z.object({
  query: z.object({
    page: z.string().transform((val) => parseInt(val, 10)).optional(),
    limit: z.string().transform((val) => parseInt(val, 10)).optional(),
    sort: z.string().regex(/^(id|author|company|rating|createdAt|role):(asc|desc)$/, 'Invalid sort format').optional(),
    projectId: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid project ID');
      return num;
    }).optional(),
    clientId: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid client ID');
      return num;
    }).optional()
  })
});

// Search testimonials schema
export const searchTestimonialSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
    page: z.string().transform((val) => parseInt(val, 10)).optional(),
    limit: z.string().transform((val) => parseInt(val, 10)).optional(),
    sort: z.string().regex(/^(id|author|company|rating|createdAt|role):(asc|desc)$/, 'Invalid sort format').optional(),
    projectId: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid project ID');
      return num;
    }).optional(),
    clientId: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) throw new Error('Invalid client ID');
      return num;
    }).optional()
  })
});

// Format Zod error helper
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};