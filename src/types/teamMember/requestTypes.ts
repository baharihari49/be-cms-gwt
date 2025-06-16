// types/teamMember/requestTypes.ts
import { Request } from 'express';
import { Prisma } from '@prisma/client';

// API Request Input types (for validation and controller use)
export interface TeamMemberApiCreateInput {
  name: string;
  position: string;
  department: string;
  bio: string;
  avatar: string;
  skills: string[]; // Array of strings from API
  experience: string;
  projects: string;
  speciality: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
    website?: string;
  };
  gradient: string;
  icon: string;
  achievements?: Array<{
    title: string;
    description: string;
    date: string;
    type?: 'award' | 'certification' | 'project' | 'recognition';
  }>;
}

export interface TeamMemberApiUpdateInput {
  name?: string;
  position?: string;
  department?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  experience?: string;
  projects?: string;
  speciality?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
    website?: string;
  };
  gradient?: string;
  icon?: string;
  achievements?: Array<{
    title: string;
    description: string;
    date: string;
    type?: 'award' | 'certification' | 'project' | 'recognition';
  }>;
}

// Base request interface
export interface TeamMemberRequest extends Request {}

// Get all team members request
export interface GetAllTeamMembersRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
    department?: string;
    position?: string;
    speciality?: string;
  };
}

// Get team member by ID request
export interface GetTeamMemberByIdRequest extends Request {
  params: {
    id: string;
  };
}

// Get team member by name request
export interface GetTeamMemberByNameRequest extends Request {
  params: {
    name: string;
  };
}

// Get team members by department request
export interface GetTeamMembersByDepartmentRequest extends Request {
  params: {
    department: string;
  };
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

// Create team member request
export interface CreateTeamMemberRequest extends Request {
  body: TeamMemberApiCreateInput;
}

// Update team member request
export interface UpdateTeamMemberRequest extends Request {
  params: {
    id: string;
  };
  body: TeamMemberApiUpdateInput;
}

// Delete team member request
export interface DeleteTeamMemberRequest extends Request {
  params: {
    id: string;
  };
}

// Search team members request
export interface SearchTeamMemberRequest extends Request {
  query: {
    q: string;
    page?: string;
    limit?: string;
    sort?: string;
    department?: string;
    position?: string;
    speciality?: string;
  };
}