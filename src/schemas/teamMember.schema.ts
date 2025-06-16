// schemas/teamMember.schema.ts
import { z } from 'zod';

// Base schemas
export const teamMemberNameSchema = z
  .string()
  .min(2, 'Team member name must be at least 2 characters long')
  .max(100, 'Team member name must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Team member name cannot be empty');

export const teamMemberPositionSchema = z
  .string()
  .min(2, 'Position must be at least 2 characters long')
  .max(100, 'Position must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Position cannot be empty');

export const teamMemberDepartmentSchema = z
  .string()
  .min(2, 'Department must be at least 2 characters long')
  .max(100, 'Department must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Department cannot be empty');

export const teamMemberBioSchema = z
  .string()
  .max(2000, 'Bio must not exceed 2000 characters')
  .trim()
  .refine(val => val.length > 0, 'Bio cannot be empty');

export const teamMemberAvatarSchema = z
  .string()
  .max(255, 'Avatar URL must not exceed 255 characters')
  .url('Avatar must be a valid URL')
  .trim()
  .refine(val => val.length > 0, 'Avatar URL cannot be empty');

export const teamMemberSkillsSchema = z
  .array(z.string())
  .min(1, 'At least one skill must be provided')
  .max(20, 'Maximum 20 skills allowed')
  .refine(
    skills => skills.every(skill => skill.trim().length > 0),
    'All skills must be non-empty strings'
  );

export const teamMemberExperienceSchema = z
  .string()
  .min(1, 'Experience must be at least 1 character long')
  .max(50, 'Experience must not exceed 50 characters')
  .trim()
  .refine(val => val.length > 0, 'Experience cannot be empty');

export const teamMemberProjectsSchema = z
  .string()
  .max(1000, 'Projects must not exceed 1000 characters')
  .trim()
  .refine(val => val.length > 0, 'Projects cannot be empty');

export const teamMemberSpecialitySchema = z
  .string()
  .min(2, 'Speciality must be at least 2 characters long')
  .max(100, 'Speciality must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Speciality cannot be empty');

export const teamMemberSocialSchema = z
  .object({
    linkedin: z.string().url('LinkedIn must be a valid URL').optional(),
    twitter: z.string().url('Twitter must be a valid URL').optional(),
    github: z.string().url('GitHub must be a valid URL').optional(),
    email: z.string().email('Email must be a valid email address').optional(),
    website: z.string().url('Website must be a valid URL').optional()
  })
  .refine(
    social => Object.keys(social).length > 0,
    'At least one social media link must be provided'
  );

export const teamMemberGradientSchema = z
  .string()
  .min(3, 'Gradient must be at least 3 characters long')
  .max(100, 'Gradient must not exceed 100 characters')
  .trim()
  .refine(val => val.length > 0, 'Gradient cannot be empty');

export const teamMemberIconSchema = z
  .string()
  .min(1, 'Icon must be at least 1 character long')
  .max(50, 'Icon must not exceed 50 characters')
  .trim()
  .refine(val => val.length > 0, 'Icon cannot be empty');

export const teamMemberAchievementsSchema = z
  .array(z.object({
    title: z.string().min(1, 'Achievement title is required'),
    description: z.string().min(1, 'Achievement description is required'),
    date: z.string().min(1, 'Achievement date is required'),
    type: z.enum(['award', 'certification', 'project', 'recognition']).optional()
  }))
  .max(10, 'Maximum 10 achievements allowed')
  .optional();

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
    .min(2, 'Team member name must be at least 2 characters long')
    .max(100, 'Team member name must not exceed 100 characters')
    .trim()
});

// TeamMember CRUD schemas
export const createTeamMemberSchema = z.object({
  body: z.object({
    name: teamMemberNameSchema,
    position: teamMemberPositionSchema,
    department: teamMemberDepartmentSchema,
    bio: teamMemberBioSchema,
    avatar: teamMemberAvatarSchema,
    skills: teamMemberSkillsSchema,
    experience: teamMemberExperienceSchema,
    projects: teamMemberProjectsSchema,
    speciality: teamMemberSpecialitySchema,
    social: teamMemberSocialSchema,
    gradient: teamMemberGradientSchema,
    icon: teamMemberIconSchema,
    achievements: teamMemberAchievementsSchema
  })
});

export const updateTeamMemberSchema = z.object({
  params: idParamSchema,
  body: z.object({
    name: teamMemberNameSchema.optional(),
    position: teamMemberPositionSchema.optional(),
    department: teamMemberDepartmentSchema.optional(),
    bio: teamMemberBioSchema.optional(),
    avatar: teamMemberAvatarSchema.optional(),
    skills: teamMemberSkillsSchema.optional(),
    experience: teamMemberExperienceSchema.optional(),
    projects: teamMemberProjectsSchema.optional(),
    speciality: teamMemberSpecialitySchema.optional(),
    social: teamMemberSocialSchema.optional(),
    gradient: teamMemberGradientSchema.optional(),
    icon: teamMemberIconSchema.optional(),
    achievements: teamMemberAchievementsSchema.optional()
  }).refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided for update'
  )
});

export const getTeamMemberByIdSchema = z.object({
  params: idParamSchema
});

export const getTeamMemberByNameSchema = z.object({
  params: nameParamSchema
});

export const deleteTeamMemberSchema = z.object({
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
      return ['id', 'name', 'position', 'department', 'experience'].includes(field) && 
             ['asc', 'desc'].includes(order);
    },
    'Sort format must be field:order (e.g., name:asc). Valid fields: id, name, position, department, experience'
  );

export const filterSchema = z.object({
  department: z.string().optional(),
  position: z.string().optional(),
  speciality: z.string().optional()
});

// Search schema
export const searchTeamMemberSchema = z.object({
  query: z.object({
    q: z
      .string()
      .min(2, 'Search query must be at least 2 characters long')
      .max(100, 'Search query must not exceed 100 characters')
      .trim(),
    ...paginationSchema.shape,
    sort: sortSchema,
    ...filterSchema.shape
  })
});

// Get all team members schema
export const getAllTeamMembersSchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema,
    ...filterSchema.shape
  })
});

// Get team members by department schema
export const getTeamMembersByDepartmentSchema = z.object({
  params: z.object({
    department: z.string().min(1, 'Department name is required')
  }),
  query: z.object({
    ...paginationSchema.shape,
    sort: sortSchema
  })
});

// Type inference from schemas
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>['body'];
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>['body'];
export type TeamMemberIdParam = z.infer<typeof idParamSchema>;
export type TeamMemberNameParam = z.infer<typeof nameParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type SearchQuery = z.infer<typeof searchTeamMemberSchema>['query'];
export type GetAllQuery = z.infer<typeof getAllTeamMembersSchema>['query'];
export type FilterQuery = z.infer<typeof filterSchema>;

// Validation error formatter
export const formatZodError = (error: z.ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validation functions
export const validateTeamMemberName = (name: string): boolean => {
  try {
    teamMemberNameSchema.parse(name);
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

// Helper function to convert API input to Prisma input
export const convertApiInputToPrismaInput = (apiInput: CreateTeamMemberInput): {
  name: string;
  position: string;
  department: string;
  bio: string;
  avatar: string;
  skills: any;
  experience: string;
  projects: string;
  speciality: string;
  social: any;
  gradient: string;
  icon: string;
  achievements: any;
} => {
  return {
    name: apiInput.name.trim(),
    position: apiInput.position.trim(),
    department: apiInput.department.trim(),
    bio: apiInput.bio.trim(),
    avatar: apiInput.avatar.trim(),
    skills: apiInput.skills, // Will be stored as JSON
    experience: apiInput.experience.trim(),
    projects: apiInput.projects.trim(),
    speciality: apiInput.speciality.trim(),
    social: apiInput.social, // Will be stored as JSON
    gradient: apiInput.gradient.trim(),
    icon: apiInput.icon.trim(),
    achievements: apiInput.achievements || [] // Will be stored as JSON
  };
};

// Helper function to convert API update input to Prisma input
export const convertApiUpdateInputToPrismaInput = (apiInput: UpdateTeamMemberInput): {
  name?: string;
  position?: string;
  department?: string;
  bio?: string;
  avatar?: string;
  skills?: any;
  experience?: string;
  projects?: string;
  speciality?: string;
  social?: any;
  gradient?: string;
  icon?: string;
  achievements?: any;
} => {
  const result: any = {};
  
  if (apiInput.name !== undefined) result.name = apiInput.name.trim();
  if (apiInput.position !== undefined) result.position = apiInput.position.trim();
  if (apiInput.department !== undefined) result.department = apiInput.department.trim();
  if (apiInput.bio !== undefined) result.bio = apiInput.bio.trim();
  if (apiInput.avatar !== undefined) result.avatar = apiInput.avatar.trim();
  if (apiInput.skills !== undefined) result.skills = apiInput.skills;
  if (apiInput.experience !== undefined) result.experience = apiInput.experience.trim();
  if (apiInput.projects !== undefined) result.projects = apiInput.projects.trim();
  if (apiInput.speciality !== undefined) result.speciality = apiInput.speciality.trim();
  if (apiInput.social !== undefined) result.social = apiInput.social;
  if (apiInput.gradient !== undefined) result.gradient = apiInput.gradient.trim();
  if (apiInput.icon !== undefined) result.icon = apiInput.icon.trim();
  if (apiInput.achievements !== undefined) result.achievements = apiInput.achievements;
  
  return result;
};