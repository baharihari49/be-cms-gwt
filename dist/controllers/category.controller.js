"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const zod_1 = require("zod");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const client_1 = require("@prisma/client");
// Validation schemas
const createCategorySchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase alphanumeric with hyphens'),
    label: zod_1.z.string().min(1, 'Label is required')
});
const updateCategorySchema = zod_1.z.object({
    label: zod_1.z.string().min(1, 'Label is required')
});
class CategoryController {
    // Get all categories with project count
    static async getCategories(req, res) {
        try {
            const categories = await prismaClient_1.default.category.findMany({
                orderBy: { label: 'asc' },
                include: {
                    _count: {
                        select: { projects: true }
                    }
                }
            });
            // Transform to include actual count
            const transformedCategories = categories.map((cat) => ({
                id: cat.id,
                label: cat.label,
                count: cat._count.projects,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt
            }));
            res.json({ categories: transformedCategories });
        }
        catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Get single category with projects
    static async getCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await prismaClient_1.default.category.findUnique({
                where: { id },
                include: {
                    projects: {
                        include: {
                            technologies: {
                                include: {
                                    technology: true
                                }
                            },
                            features: {
                                include: {
                                    feature: true
                                }
                            },
                            metrics: true,
                            links: true
                        }
                    }
                }
            });
            if (!category) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
            // Transform projects
            const transformedCategory = {
                ...category,
                projects: category.projects.map((project) => ({
                    ...project,
                    technologies: project.technologies.map(pt => pt.technology.name),
                    features: project.features.map(pf => pf.feature.name)
                }))
            };
            res.json({ category: transformedCategory });
        }
        catch (error) {
            console.error('Get category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Create category (Admin only)
    static async createCategory(req, res) {
        try {
            const validatedData = createCategorySchema.parse(req.body);
            // Check if category already exists
            const existingCategory = await prismaClient_1.default.category.findUnique({
                where: { id: validatedData.id }
            });
            if (existingCategory) {
                res.status(400).json({ error: 'Category ID already exists' });
                return;
            }
            const category = await prismaClient_1.default.category.create({
                data: {
                    id: validatedData.id,
                    label: validatedData.label,
                    count: 0
                }
            });
            res.status(201).json({
                message: 'Category created successfully',
                category
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                });
                return;
            }
            console.error('Create category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Update category (Admin only)
    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const validatedData = updateCategorySchema.parse(req.body);
            const category = await prismaClient_1.default.category.update({
                where: { id },
                data: {
                    label: validatedData.label
                }
            });
            res.json({
                message: 'Category updated successfully',
                category
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                res.status(400).json({
                    error: 'Validation error',
                    details: error.errors
                });
                return;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    res.status(404).json({ error: 'Category not found' });
                    return;
                }
            }
            console.error('Update category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Delete category (Admin only)
    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            // Check if category has projects
            const projectCount = await prismaClient_1.default.project.count({
                where: { categoryId: id }
            });
            if (projectCount > 0) {
                res.status(400).json({
                    error: 'Cannot delete category with existing projects',
                    projectCount
                });
                return;
            }
            await prismaClient_1.default.category.delete({
                where: { id }
            });
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    res.status(404).json({ error: 'Category not found' });
                    return;
                }
            }
            console.error('Delete category error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Recalculate category counts (Admin only)
    static async recalculateCounts(req, res) {
        try {
            const categories = await prismaClient_1.default.category.findMany();
            const updates = await Promise.all(categories.map(async (category) => {
                const count = await prismaClient_1.default.project.count({
                    where: { categoryId: category.id }
                });
                return prismaClient_1.default.category.update({
                    where: { id: category.id },
                    data: { count }
                });
            }));
            res.json({
                message: 'Category counts recalculated successfully',
                categories: updates
            });
        }
        catch (error) {
            console.error('Recalculate counts error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.CategoryController = CategoryController;
