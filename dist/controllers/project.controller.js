"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const projectService_1 = require("../services/projectService");
const errorHandler_1 = require("../utils/errorHandler");
const projectSchemas_1 = require("../schemas/projectSchemas");
class ProjectController {
    // Get all projects with filters
    static async getProjects(req, res) {
        try {
            const query = projectSchemas_1.querySchema.parse(req.query);
            const result = await projectService_1.ProjectService.getProjects(query);
            res.json({
                success: true,
                projects: result.projects,
                pagination: result.pagination
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Get projects');
        }
    }
    // Get single project
    static async getProject(req, res) {
        try {
            const id = errorHandler_1.ErrorHandler.validateId(req.params.id, 'project ID');
            const project = await projectService_1.ProjectService.getProjectById(id);
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
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Get project');
        }
    }
    // Create project (Admin only)
    static async createProject(req, res) {
        try {
            const validatedData = projectSchemas_1.createProjectSchema.parse(req.body);
            const project = await projectService_1.ProjectService.createProject(validatedData);
            res.status(201).json({
                success: true,
                message: 'Project created successfully',
                project
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Create project');
        }
    }
    // Update project (Admin only)
    static async updateProject(req, res) {
        try {
            const id = errorHandler_1.ErrorHandler.validateId(req.params.id, 'project ID');
            const validatedData = projectSchemas_1.updateProjectSchema.parse(req.body);
            const project = await projectService_1.ProjectService.updateProject(id, validatedData);
            res.json({
                success: true,
                message: 'Project updated successfully',
                project
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Update project');
        }
    }
    // Delete project (Admin only)
    static async deleteProject(req, res) {
        try {
            const id = errorHandler_1.ErrorHandler.validateId(req.params.id, 'project ID');
            const result = await projectService_1.ProjectService.deleteProject(id);
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Delete project');
        }
    }
    // Get all categories
    static async getCategories(req, res) {
        try {
            const categories = await projectService_1.ProjectService.getCategories();
            res.json({
                success: true,
                categories
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Get categories');
        }
    }
    // Get project statistics
    static async getStatistics(req, res) {
        try {
            const statistics = await projectService_1.ProjectService.getStatistics();
            res.json({
                success: true,
                statistics
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Get statistics');
        }
    }
    // Add image to project
    static async addProjectImage(req, res) {
        try {
            const projectId = errorHandler_1.ErrorHandler.validateId(req.params.id, 'project ID');
            const validatedData = projectSchemas_1.addImageSchema.parse(req.body);
            const image = await projectService_1.ProjectService.addProjectImage(projectId, validatedData);
            res.status(201).json({
                success: true,
                message: 'Image added successfully',
                image
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Add image');
        }
    }
    // Delete project image
    static async deleteProjectImage(req, res) {
        try {
            const imageId = errorHandler_1.ErrorHandler.validateId(req.params.imageId, 'image ID');
            await projectService_1.ProjectService.deleteProjectImage(imageId);
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Delete image');
        }
    }
    // Add review to project
    static async addProjectReview(req, res) {
        try {
            const projectId = errorHandler_1.ErrorHandler.validateId(req.params.id, 'project ID');
            const validatedData = projectSchemas_1.addReviewSchema.parse(req.body);
            const review = await projectService_1.ProjectService.addProjectReview(projectId, validatedData);
            res.status(201).json({
                success: true,
                message: 'Review added successfully',
                review
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Add review');
        }
    }
    // Delete project review
    static async deleteProjectReview(req, res) {
        try {
            const reviewId = errorHandler_1.ErrorHandler.validateId(req.params.reviewId, 'review ID');
            await projectService_1.ProjectService.deleteProjectReview(reviewId);
            res.json({
                success: true,
                message: 'Review deleted successfully'
            });
        }
        catch (error) {
            errorHandler_1.ErrorHandler.handleError(error, res, 'Delete review');
        }
    }
}
exports.ProjectController = ProjectController;
