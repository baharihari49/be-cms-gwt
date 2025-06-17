// types/hero/heroTypes.ts
import { Request } from 'express';

// Base Hero Section type
export interface HeroSection {
  id: string;
  welcomeText: string;
  mainTitle: string;
  highlightText: string;
  description: string;
  logo: string | null;
  image: string | null;
  altText: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Social Media type
export interface SocialMedia {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for create and update
export interface HeroSectionCreateInput {
  welcomeText: string;
  mainTitle: string;
  highlightText: string;
  description: string;
  logo?: string | null;
  image?: string | null;
  altText?: string | null;
  isActive?: boolean;
}

export interface HeroSectionUpdateInput {
  welcomeText?: string;
  mainTitle?: string;
  highlightText?: string;
  description?: string;
  logo?: string | null;
  image?: string | null;
  altText?: string | null;
  isActive?: boolean;
}

export interface SocialMediaCreateInput {
  name: string;
  url: string;
  isActive?: boolean;
  order?: number;
}

export interface SocialMediaUpdateInput {
  name?: string;
  url?: string;
  isActive?: boolean;
  order?: number;
}

// Query options
export interface HeroQueryOptions {
  include?: {
    socialMedia?: boolean;
  };
}

export interface SocialMediaQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: any;
}

// Response types
export interface HeroSectionResponse {
  success: boolean;
  data: HeroSection;
  message?: string;
}

export interface HeroSectionWithSocialMediaResponse {
  success: boolean;
  data: {
    heroSection: HeroSection;
    socialMedia: SocialMedia[];
  };
  message?: string;
}

export interface SocialMediaResponse {
  success: boolean;
  data: SocialMedia[];
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string[];
}

// Request types
export interface GetHeroSectionRequest extends Request {
  query: {
    include?: string;
  };
}

export interface CreateHeroSectionRequest extends Request {
  body: HeroSectionCreateInput;
}

export interface UpdateHeroSectionRequest extends Request {
  params: { id: string };
  body: HeroSectionUpdateInput;
}

export interface DeleteHeroSectionRequest extends Request {
  params: { id: string };
}

export interface GetSocialMediaRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}

export interface CreateSocialMediaRequest extends Request {
  body: SocialMediaCreateInput;
}

export interface UpdateSocialMediaRequest extends Request {
  params: { id: string };
  body: SocialMediaUpdateInput;
}

export interface DeleteSocialMediaRequest extends Request {
  params: { id: string };
}