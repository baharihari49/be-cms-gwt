// types/hero/serviceTypes.ts
import {
  HeroSection,
  SocialMedia,
  HeroSectionCreateInput,
  HeroSectionUpdateInput,
  SocialMediaCreateInput,
  SocialMediaUpdateInput,
  SocialMediaQueryOptions
} from './heroTypes';

export interface IHeroService {
  // Hero Section methods
  getActiveHeroSection(include?: { socialMedia?: boolean }): Promise<HeroSection | null>;
  getHeroSectionById(id: string, include?: { socialMedia?: boolean }): Promise<HeroSection>;
  getHeroData(): Promise<{ heroSection: HeroSection | null; socialMedia: SocialMedia[] }>;
  createHeroSection(data: HeroSectionCreateInput): Promise<HeroSection>;
  updateHeroSection(id: string, data: HeroSectionUpdateInput): Promise<HeroSection>;
  deleteHeroSection(id: string): Promise<{ message: string }>;
  getAllHeroSections(): Promise<HeroSection[]>;

  // Social Media methods
  getAllSocialMedia(options?: SocialMediaQueryOptions): Promise<SocialMedia[]>;
  getSocialMediaById(id: string): Promise<SocialMedia>;
  createSocialMedia(data: SocialMediaCreateInput): Promise<SocialMedia>;
  updateSocialMedia(id: string, data: SocialMediaUpdateInput): Promise<SocialMedia>;
  deleteSocialMedia(id: string): Promise<{ message: string }>;
  getSocialMediaCount(): Promise<number>;
}