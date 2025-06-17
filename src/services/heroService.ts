// services/heroService.ts
import { PrismaClient } from '@prisma/client';
import { 
  HeroSection,
  SocialMedia,
  HeroSectionCreateInput,
  HeroSectionUpdateInput,
  SocialMediaCreateInput,
  SocialMediaUpdateInput,
  HeroQueryOptions,
  SocialMediaQueryOptions
} from '../types/hero/heroTypes';

const prisma = new PrismaClient();

class HeroService {
  // Get active hero section
  async getActiveHeroSection(include: { socialMedia?: boolean } = {}): Promise<HeroSection | null> {
    try {
      const heroSection = await prisma.heroSection.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      return heroSection;
    } catch (error: any) {
      throw new Error(`Failed to fetch hero section: ${error.message}`);
    }
  }

  // Get hero section by ID
  async getHeroSectionById(id: string, include: { socialMedia?: boolean } = {}): Promise<HeroSection> {
    try {
      const heroSection = await prisma.heroSection.findUnique({
        where: { id }
      });

      if (!heroSection) {
        throw new Error('Hero section not found');
      }

      return heroSection;
    } catch (error: any) {
      throw new Error(`Failed to fetch hero section: ${error.message}`);
    }
  }

  // Get hero data with social media
  async getHeroData(): Promise<{ heroSection: HeroSection | null; socialMedia: SocialMedia[] }> {
    try {
      const [heroSection, socialMedia] = await Promise.all([
        this.getActiveHeroSection(),
        this.getAllSocialMedia({ orderBy: { order: 'asc' } })
      ]);

      return {
        heroSection,
        socialMedia: socialMedia.filter(sm => sm.isActive)
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch hero data: ${error.message}`);
    }
  }

  // Create new hero section
  async createHeroSection(data: HeroSectionCreateInput): Promise<HeroSection> {
    try {
      const { welcomeText, mainTitle, highlightText, description, logo, image, altText, isActive } = data;

      // If creating an active hero section, deactivate others
      if (isActive !== false) {
        await prisma.heroSection.updateMany({
          where: { isActive: true },
          data: { isActive: false }
        });
      }

      const heroSection = await prisma.heroSection.create({
        data: {
          welcomeText: welcomeText.trim(),
          mainTitle: mainTitle.trim(),
          highlightText: highlightText.trim(),
          description: description.trim(),
          logo: logo || null,
          image: image || null,
          altText: altText || null,
          isActive: isActive !== false
        }
      });

      return heroSection;
    } catch (error: any) {
      throw new Error(`Failed to create hero section: ${error.message}`);
    }
  }

  // Update hero section
  async updateHeroSection(id: string, data: HeroSectionUpdateInput): Promise<HeroSection> {
    try {
      // Check if hero section exists
      await this.getHeroSectionById(id);

      // If setting as active, deactivate others
      if (data.isActive === true) {
        await prisma.heroSection.updateMany({
          where: { 
            isActive: true,
            id: { not: id }
          },
          data: { isActive: false }
        });
      }

      const updateData: any = {};
      if (data.welcomeText !== undefined) updateData.welcomeText = data.welcomeText.trim();
      if (data.mainTitle !== undefined) updateData.mainTitle = data.mainTitle.trim();
      if (data.highlightText !== undefined) updateData.highlightText = data.highlightText.trim();
      if (data.description !== undefined) updateData.description = data.description.trim();
      if (data.logo !== undefined) updateData.logo = data.logo || null;
      if (data.image !== undefined) updateData.image = data.image || null;
      if (data.altText !== undefined) updateData.altText = data.altText || null;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const updatedHeroSection = await prisma.heroSection.update({
        where: { id },
        data: updateData
      });

      return updatedHeroSection;
    } catch (error: any) {
      throw new Error(`Failed to update hero section: ${error.message}`);
    }
  }

  // Delete hero section
  async deleteHeroSection(id: string): Promise<{ message: string }> {
    try {
      // Check if hero section exists
      await this.getHeroSectionById(id);

      await prisma.heroSection.delete({
        where: { id }
      });

      return { message: 'Hero section deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete hero section: ${error.message}`);
    }
  }

  // Get all social media
  async getAllSocialMedia(options: SocialMediaQueryOptions = {}): Promise<SocialMedia[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const socialMedia = await prisma.socialMedia.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { order: 'asc' }
      });
      
      return socialMedia;
    } catch (error: any) {
      throw new Error(`Failed to fetch social media: ${error.message}`);
    }
  }

  // Get social media by ID
  async getSocialMediaById(id: string): Promise<SocialMedia> {
    try {
      const socialMedia = await prisma.socialMedia.findUnique({
        where: { id }
      });

      if (!socialMedia) {
        throw new Error('Social media not found');
      }

      return socialMedia;
    } catch (error: any) {
      throw new Error(`Failed to fetch social media: ${error.message}`);
    }
  }

  // Create new social media
  async createSocialMedia(data: SocialMediaCreateInput): Promise<SocialMedia> {
    try {
      const { name, url, isActive, order } = data;

      const socialMedia = await prisma.socialMedia.create({
        data: {
          name: name.trim(),
          url: url.trim(),
          isActive: isActive !== false,
          order: order || 0
        }
      });

      return socialMedia;
    } catch (error: any) {
      throw new Error(`Failed to create social media: ${error.message}`);
    }
  }

  // Update social media
  async updateSocialMedia(id: string, data: SocialMediaUpdateInput): Promise<SocialMedia> {
    try {
      // Check if social media exists
      await this.getSocialMediaById(id);

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.url !== undefined) updateData.url = data.url.trim();
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.order !== undefined) updateData.order = data.order;

      const updatedSocialMedia = await prisma.socialMedia.update({
        where: { id },
        data: updateData
      });

      return updatedSocialMedia;
    } catch (error: any) {
      throw new Error(`Failed to update social media: ${error.message}`);
    }
  }

  // Delete social media
  async deleteSocialMedia(id: string): Promise<{ message: string }> {
    try {
      // Check if social media exists
      await this.getSocialMediaById(id);

      await prisma.socialMedia.delete({
        where: { id }
      });

      return { message: 'Social media deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete social media: ${error.message}`);
    }
  }

  // Get social media count
  async getSocialMediaCount(): Promise<number> {
    try {
      const count = await prisma.socialMedia.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count social media: ${error.message}`);
    }
  }

  // Get all hero sections (for admin)
  async getAllHeroSections(): Promise<HeroSection[]> {
    try {
      const heroSections = await prisma.heroSection.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return heroSections;
    } catch (error: any) {
      throw new Error(`Failed to fetch hero sections: ${error.message}`);
    }
  }
}

export default new HeroService();