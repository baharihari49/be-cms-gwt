// controllers/heroController.ts
import { Response } from 'express';
import heroService from '../../services/heroService';
import {
  GetHeroSectionRequest,
  CreateHeroSectionRequest,
  UpdateHeroSectionRequest,
  DeleteHeroSectionRequest,
  GetSocialMediaRequest,
  CreateSocialMediaRequest,
  UpdateSocialMediaRequest,
  DeleteSocialMediaRequest
} from '../../types/hero/heroTypes';
import {
  createHeroSectionSchema,
  updateHeroSectionSchema,
  getHeroSectionSchema,
  deleteHeroSectionSchema,
  createSocialMediaSchema,
  updateSocialMediaSchema,
  deleteSocialMediaSchema,
  getSocialMediaSchema,
  formatZodError
} from '../../schemas/heroSchema';
import { ZodError } from 'zod';
import { 
  sendSuccessResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  sendCreatedResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class HeroController {
  // GET /api/hero - Get active hero section with social media
  async getHeroData(req: GetHeroSectionRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getHeroSectionSchema.parse({ query: req.query });
      const { include } = validatedQuery.query;

      // Always include social media for public route, or use include parameter
      const shouldIncludeSocialMedia = !include || include.includes('socialMedia');
      
      let heroData;
      
      if (shouldIncludeSocialMedia) {
        heroData = await heroService.getHeroData();
      } else {
        const heroSection = await heroService.getActiveHeroSection();
        heroData = { heroSection, socialMedia: [] };
      }

      sendSuccessResponse(res, heroData, 'Hero data retrieved successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/hero/sections - Get all hero sections (admin)
  async getAllHeroSections(req: GetHeroSectionRequest, res: Response): Promise<void> {
    try {
      const heroSections = await heroService.getAllHeroSections();
      sendSuccessResponse(res, heroSections, 'Hero sections retrieved successfully');

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/hero/sections/:id - Get hero section by ID
  async getHeroSectionById(req: UpdateHeroSectionRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteHeroSectionSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const heroSection = await heroService.getHeroSectionById(id);
      sendSuccessResponse(res, heroSection, 'Hero section retrieved successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // POST /api/hero/sections - Create new hero section
  async createHeroSection(req: CreateHeroSectionRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = createHeroSectionSchema.parse({ body: req.body });
      const { welcomeText, mainTitle, highlightText, description, logo, image, altText, isActive } = validatedData.body;

      const heroSectionData = {
        welcomeText: welcomeText.trim(),
        mainTitle: mainTitle.trim(),
        highlightText: highlightText.trim(),
        description: description.trim(),
        logo: logo || null,
        image: image || null,
        altText: altText || null,
        isActive: isActive
      };

      const heroSection = await heroService.createHeroSection(heroSectionData);
      sendCreatedResponse(res, heroSection, 'Hero section created successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // PUT /api/hero/sections/:id - Update hero section
  async updateHeroSection(req: UpdateHeroSectionRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const validatedData = updateHeroSectionSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      // Clean update data
      const cleanUpdateData: any = {};
      if (updateData.welcomeText !== undefined) cleanUpdateData.welcomeText = updateData.welcomeText.trim();
      if (updateData.mainTitle !== undefined) cleanUpdateData.mainTitle = updateData.mainTitle.trim();
      if (updateData.highlightText !== undefined) cleanUpdateData.highlightText = updateData.highlightText.trim();
      if (updateData.description !== undefined) cleanUpdateData.description = updateData.description.trim();
      if (updateData.logo !== undefined) cleanUpdateData.logo = updateData.logo || null;
      if (updateData.image !== undefined) cleanUpdateData.image = updateData.image || null;
      if (updateData.altText !== undefined) cleanUpdateData.altText = updateData.altText || null;
      if (updateData.isActive !== undefined) cleanUpdateData.isActive = updateData.isActive;

      const heroSection = await heroService.updateHeroSection(id, cleanUpdateData);
      sendSuccessResponse(res, heroSection, 'Hero section updated successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // DELETE /api/hero/sections/:id - Delete hero section
  async deleteHeroSection(req: DeleteHeroSectionRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteHeroSectionSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await heroService.deleteHeroSection(id);
      sendSuccessResponse(res, null, result.message);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/hero/social-media - Get all social media (public version)
  async getAllSocialMedia(req: GetSocialMediaRequest, res: Response): Promise<void> {
    try {
      // For public route, only return active social media, ordered by order field
      const socialMedia = await heroService.getAllSocialMedia({ 
        orderBy: { order: 'asc' } 
      });
      
      // Filter only active social media for public
      const activeSocialMedia = socialMedia.filter(sm => sm.isActive);
      
      sendSuccessResponse(res, activeSocialMedia, 'Social media retrieved successfully');

    } catch (error: any) {
      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/hero/admin/social-media - Get all social media with pagination (admin version)
  async getAllSocialMediaAdmin(req: GetSocialMediaRequest, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = getSocialMediaSchema.parse({ query: req.query });
      const { page, limit, sort } = validatedQuery.query;
      
      // Parse pagination
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      // Parse sorting
      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['order', 'name', 'createdAt'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const socialMedia = await heroService.getAllSocialMedia(options);
      const total = await heroService.getSocialMediaCount();

      sendPaginatedResponse(res, socialMedia, {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      });

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // POST /api/hero/social-media - Create new social media
  async createSocialMedia(req: CreateSocialMediaRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = createSocialMediaSchema.parse({ body: req.body });
      const { name, url, isActive, order } = validatedData.body;

      const socialMediaData = {
        name: name.trim(),
        url: url.trim(),
        isActive: isActive,
        order: order
      };

      const socialMedia = await heroService.createSocialMedia(socialMediaData);
      sendCreatedResponse(res, socialMedia, 'Social media created successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/hero/social-media/:id - Get social media by ID
  async getSocialMediaById(req: UpdateSocialMediaRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteSocialMediaSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const socialMedia = await heroService.getSocialMediaById(id);
      sendSuccessResponse(res, socialMedia, 'Social media retrieved successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // PUT /api/hero/social-media/:id - Update social media
  async updateSocialMedia(req: UpdateSocialMediaRequest, res: Response): Promise<void> {
    try {
      // Validate parameters and body
      const validatedData = updateSocialMediaSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      // Clean update data
      const cleanUpdateData: any = {};
      if (updateData.name !== undefined) cleanUpdateData.name = updateData.name.trim();
      if (updateData.url !== undefined) cleanUpdateData.url = updateData.url.trim();
      if (updateData.isActive !== undefined) cleanUpdateData.isActive = updateData.isActive;
      if (updateData.order !== undefined) cleanUpdateData.order = updateData.order;

      const socialMedia = await heroService.updateSocialMedia(id, cleanUpdateData);
      sendSuccessResponse(res, socialMedia, 'Social media updated successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // DELETE /api/hero/social-media/:id - Delete social media
  async deleteSocialMedia(req: DeleteSocialMediaRequest, res: Response): Promise<void> {
    try {
      // Validate parameters
      const validatedData = deleteSocialMediaSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await heroService.deleteSocialMedia(id);
      sendSuccessResponse(res, null, result.message);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }
}

export default new HeroController();