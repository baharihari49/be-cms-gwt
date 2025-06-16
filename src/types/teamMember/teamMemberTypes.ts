// types/teamMember/teamMemberTypes.ts
import { Request } from 'express';
import { Prisma } from '@prisma/client';

// Base TeamMember interface
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  bio: string;
  avatar: string;
  skills: Prisma.JsonValue; // JSON field
  experience: string;
  projects: string;
  speciality: string;
  social: Prisma.JsonValue; // JSON field
  gradient: string;
  icon: string;
  achievements: Prisma.JsonValue; // JSON field
}

// Social links interface (for TypeScript type checking)
export interface SocialLinks {
  [key: string]: any; // Index signature for Prisma compatibility
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  website?: string;
}

// Achievement interface (for TypeScript type checking)
export interface Achievement {
  [key: string]: any; // Index signature for Prisma compatibility
  title: string;
  description: string;
  date: string;
  type?: 'award' | 'certification' | 'project' | 'recognition';
}

// Input types for CRUD operations (compatible with Prisma)
export interface TeamMemberCreateInput {
  name: string;
  position: string;
  department: string;
  bio: string;
  avatar: string;
  skills: Prisma.InputJsonValue; // Prisma JSON type
  experience: string;
  projects: string;
  speciality: string;
  social: Prisma.InputJsonValue; // Prisma JSON type
  gradient: string;
  icon: string;
  achievements?: Prisma.InputJsonValue; // Prisma JSON type
}

export interface TeamMemberUpdateInput {
  name?: string;
  position?: string;
  department?: string;
  bio?: string;
  avatar?: string;
  skills?: Prisma.InputJsonValue; // Prisma JSON type
  experience?: string;
  projects?: string;
  speciality?: string;
  social?: Prisma.InputJsonValue; // Prisma JSON type
  gradient?: string;
  icon?: string;
  achievements?: Prisma.InputJsonValue; // Prisma JSON type
}

// Query options for database operations
export interface TeamMemberQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
  where?: {
    department?: string;
    position?: string;
    speciality?: string;
    name?: {
      contains: string;
    };
    OR?: Array<{
      name?: { contains: string };
      position?: { contains: string };
      department?: { contains: string };
      bio?: { contains: string };
      speciality?: { contains: string };
    }>;
  };
}

// Response types
export interface TeamMemberResponse {
  success: boolean;
  data: TeamMember;
  message?: string;
}

export interface TeamMembersResponse {
  success: boolean;
  data: TeamMember[];
  pagination?: PaginationInfo;
  message?: string;
}

export interface TeamMemberSearchResponse {
  success: boolean;
  data: TeamMember[];
  query: string;
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
}

// Filter options
export interface FilterOptions {
  department?: string;
  position?: string;
  speciality?: string;
}