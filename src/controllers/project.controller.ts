// controllers/projectController.ts (Improved version with ErrorHandler)
import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import { ProjectService } from '../services/projectService';
import { ErrorHandler } from '../utils/errorHandler';
import {
  createProjectSchema,
  updateProjectSchema,
  querySchema,
  addImageSchema,
  addReviewSchema
} from '../schemas/projectSchemas';
import { CreateProjectImage, CreateProjectReview } from '../types/project';

export class ProjectController {
  // Get all projects with filters
  static async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const query = querySchema.parse(req.query);
      const result = await ProjectService.getProjects(query);

      res.json({
        success: true,
        projects: result.projects,
        pagination: result.pagination
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Get projects');
    }
  }

  // Get single project
  static async getProject(req: Request, res: Response): Promise<void> {
    try {
      const id = ErrorHandler.validateId(req.params.id, 'project ID');
      const project = await ProjectService.getProjectById(id);

      if (!project) {
        res.status(404).json({ 
          success: false,
          error: 'Project not found' 
        });
        return;
      }

      res.json({ 
        success: true,
        project 
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Get project');
    }
  }

  // Create project (Admin only)
  static async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      const project = await ProjectService.createProject(validatedData);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Create project');
    }
  }

  // Update project (Admin only)
  static async updateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = ErrorHandler.validateId(req.params.id, 'project ID');
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await ProjectService.updateProject(id, validatedData);

      res.json({
        success: true,
        message: 'Project updated successfully',
        project
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Update project');
    }
  }

  // Delete project (Admin only)
  static async deleteProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = ErrorHandler.validateId(req.params.id, 'project ID');
      const result = await ProjectService.deleteProject(id);
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Delete project');
    }
  }

  // Get all categories
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await ProjectService.getCategories();
      
      res.json({ 
        success: true,
        categories 
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Get categories');
    }
  }

  // Get project statistics
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await ProjectService.getStatistics();
      
      res.json({ 
        success: true,
        statistics 
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Get statistics');
    }
  }

  // Add image to project
  static async addProjectImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projectId = ErrorHandler.validateId(req.params.id, 'project ID');
      const validatedData = addImageSchema.parse(req.body) as CreateProjectImage;
      const image = await ProjectService.addProjectImage(projectId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Image added successfully',
        image
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Add image');
    }
  }

  // Delete project image
  static async deleteProjectImage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const imageId = ErrorHandler.validateId(req.params.imageId, 'image ID');
      await ProjectService.deleteProjectImage(imageId);
      
      res.json({ 
        success: true,
        message: 'Image deleted successfully' 
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Delete image');
    }
  }

  // Add review to project
  static async addProjectReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const projectId = ErrorHandler.validateId(req.params.id, 'project ID');
      const validatedData = addReviewSchema.parse(req.body) as CreateProjectReview;
      const review = await ProjectService.addProjectReview(projectId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Add review');
    }
  }

  // Delete project review
  static async deleteProjectReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const reviewId = ErrorHandler.validateId(req.params.reviewId, 'review ID');
      await ProjectService.deleteProjectReview(reviewId);
      
      res.json({ 
        success: true,
        message: 'Review deleted successfully' 
      });
    } catch (error) {
      ErrorHandler.handleError(error, res, 'Delete review');
    }
  }
}