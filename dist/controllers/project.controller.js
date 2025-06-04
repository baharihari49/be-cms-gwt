"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const zod_1 = require("zod");
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Validation schemas
const createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    subtitle: zod_1.z.string().min(1, 'Subtitle is required'),
    categoryId: zod_1.z.string().min(1, 'Category is required'),
    type: zod_1.z.string().min(1, 'Type is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    image: zod_1.z.string().url().optional(),
    client: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    year: zod_1.z.string().optional(),
    status: zod_1.z.enum(['DEVELOPMENT', 'BETA', 'LIVE', 'ARCHIVED', 'MAINTENANCE']).optional(),
    icon: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    technologies: zod_1.z.array(zod_1.z.string()).optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    metrics: zod_1.z.object({
        users: zod_1.z.string().optional(),
        performance: zod_1.z.string().optional(),
        rating: zod_1.z.string().optional(),
        downloads: zod_1.z.string().optional(),
        revenue: zod_1.z.string().optional(),
        uptime: zod_1.z.string().optional()
    }).optional(),
    links: zod_1.z.object({
        live: zod_1.z.string().url().optional(),
        github: zod_1.z.string().url().optional(),
        case: zod_1.z.string().optional(),
        demo: zod_1.z.string().url().optional(),
        docs: zod_1.z.string().url().optional()
    }).optional()
});
const updateProjectSchema = createProjectSchema.partial();
const querySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    category: zod_1.z.string().optional(),
    status: zod_1.z.enum(['DEVELOPMENT', 'BETA', 'LIVE', 'ARCHIVED', 'MAINTENANCE']).optional(),
    search: zod_1.z.string().optional(),
    sort: zod_1.z.enum(['createdAt', 'title', 'year']).optional(),
    order: zod_1.z.enum(['asc', 'desc']).optional()
});
class ProjectController {
    // Get all projects with filters
    static async getProjects(req, res) {
        try {
            const query = querySchema.parse(req.query);
            const page = query.page || 1;
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;
            // Build where clause
            const where = {};
            if (query.category)
                where.categoryId = query.category;
            if (query.status)
                where.status = query.status;
            if (query.search) {
                where.OR = [
                    { title: { contains: query.search, mode: 'insensitive' } },
                    { subtitle: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } }
                ];
            }
            // Get projects with relations
            const [projects, total] = await Promise.all([
                prismaClient_1.default.project.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        [query.sort || 'createdAt']: query.order || 'desc'
                    },
                    include: {
                        category: true,
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
                }),
                prismaClient_1.default.project.count({ where })
            ]);
            // Transform data
            const transformedProjects = projects.map(project => ({
                ...project,
                technologies: project.technologies.map(pt => pt.technology.name),
                features: project.features.map(pf => pf.feature.name)
            }));
            res.json({
                projects: transformedProjects,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
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
            console.error('Get projects error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Get single project
    static async getProject(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid project ID' });
                return;
            }
            const project = await prismaClient_1.default.project.findUnique({
                where: { id },
                include: {
                    category: true,
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
            });
            if (!project) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }
            // Transform data
            const transformedProject = {
                ...project,
                technologies: project.technologies.map(pt => pt.technology.name),
                features: project.features.map(pf => pf.feature.name)
            };
            res.json({ project: transformedProject });
        }
        catch (error) {
            console.error('Get project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Create project (Admin only)
    static async createProject(req, res) {
        try {
            const validatedData = createProjectSchema.parse(req.body);
            // Check if category exists
            const category = await prismaClient_1.default.category.findUnique({
                where: { id: validatedData.categoryId }
            });
            if (!category) {
                res.status(400).json({ error: 'Invalid category' });
                return;
            }
            // Create project with relations
            const project = await prismaClient_1.default.project.create({
                data: {
                    title: validatedData.title,
                    subtitle: validatedData.subtitle,
                    categoryId: validatedData.categoryId,
                    type: validatedData.type,
                    description: validatedData.description,
                    image: validatedData.image,
                    client: validatedData.client,
                    duration: validatedData.duration,
                    year: validatedData.year,
                    status: validatedData.status || 'DEVELOPMENT',
                    icon: validatedData.icon,
                    color: validatedData.color,
                    // Create technologies
                    technologies: validatedData.technologies ? {
                        create: validatedData.technologies.map(tech => ({
                            technology: {
                                connectOrCreate: {
                                    where: { name: tech },
                                    create: { name: tech }
                                }
                            }
                        }))
                    } : undefined,
                    // Create features
                    features: validatedData.features ? {
                        create: validatedData.features.map(feat => ({
                            feature: {
                                connectOrCreate: {
                                    where: { name: feat },
                                    create: { name: feat }
                                }
                            }
                        }))
                    } : undefined,
                    // Create metrics
                    metrics: validatedData.metrics ? {
                        create: validatedData.metrics
                    } : undefined,
                    // Create links
                    links: validatedData.links ? {
                        create: validatedData.links
                    } : undefined
                },
                include: {
                    category: true,
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
            });
            // Update category count
            await prismaClient_1.default.category.update({
                where: { id: validatedData.categoryId },
                data: { count: { increment: 1 } }
            });
            // Transform response
            const transformedProject = {
                ...project,
                technologies: project.technologies.map(pt => pt.technology.name),
                features: project.features.map(pf => pf.feature.name)
            };
            res.status(201).json({
                message: 'Project created successfully',
                project: transformedProject
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
            console.error('Create project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Update project (Admin only)
    static async updateProject(req, res) {
        try {
            const id = parseInt(req.params.id);
            const validatedData = updateProjectSchema.parse(req.body);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid project ID' });
                return;
            }
            // Check if project exists
            const existingProject = await prismaClient_1.default.project.findUnique({
                where: { id },
                include: {
                    technologies: true,
                    features: true
                }
            });
            if (!existingProject) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }
            // Update project
            const project = await prismaClient_1.default.project.update({
                where: { id },
                data: {
                    title: validatedData.title,
                    subtitle: validatedData.subtitle,
                    categoryId: validatedData.categoryId,
                    type: validatedData.type,
                    description: validatedData.description,
                    image: validatedData.image,
                    client: validatedData.client,
                    duration: validatedData.duration,
                    year: validatedData.year,
                    status: validatedData.status,
                    icon: validatedData.icon,
                    color: validatedData.color,
                    // Update technologies if provided
                    technologies: validatedData.technologies ? {
                        deleteMany: {},
                        create: validatedData.technologies.map(tech => ({
                            technology: {
                                connectOrCreate: {
                                    where: { name: tech },
                                    create: { name: tech }
                                }
                            }
                        }))
                    } : undefined,
                    // Update features if provided
                    features: validatedData.features ? {
                        deleteMany: {},
                        create: validatedData.features.map(feat => ({
                            feature: {
                                connectOrCreate: {
                                    where: { name: feat },
                                    create: { name: feat }
                                }
                            }
                        }))
                    } : undefined,
                    // Update metrics if provided
                    metrics: validatedData.metrics ? {
                        upsert: {
                            create: validatedData.metrics,
                            update: validatedData.metrics
                        }
                    } : undefined,
                    // Update links if provided
                    links: validatedData.links ? {
                        upsert: {
                            create: validatedData.links,
                            update: validatedData.links
                        }
                    } : undefined
                },
                include: {
                    category: true,
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
            });
            // Update category counts if category changed
            if (validatedData.categoryId && validatedData.categoryId !== existingProject.categoryId) {
                await Promise.all([
                    prismaClient_1.default.category.update({
                        where: { id: existingProject.categoryId },
                        data: { count: { decrement: 1 } }
                    }),
                    prismaClient_1.default.category.update({
                        where: { id: validatedData.categoryId },
                        data: { count: { increment: 1 } }
                    })
                ]);
            }
            // Transform response
            const transformedProject = {
                ...project,
                technologies: project.technologies.map(pt => pt.technology.name),
                features: project.features.map(pf => pf.feature.name)
            };
            res.json({
                message: 'Project updated successfully',
                project: transformedProject
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
            console.error('Update project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Delete project (Admin only)
    static async deleteProject(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid project ID' });
                return;
            }
            const project = await prismaClient_1.default.project.findUnique({
                where: { id }
            });
            if (!project) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }
            // Delete project (cascade will handle relations)
            await prismaClient_1.default.project.delete({
                where: { id }
            });
            // Update category count
            await prismaClient_1.default.category.update({
                where: { id: project.categoryId },
                data: { count: { decrement: 1 } }
            });
            res.json({ message: 'Project deleted successfully' });
        }
        catch (error) {
            console.error('Delete project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Get all categories
    static async getCategories(req, res) {
        try {
            const categories = await prismaClient_1.default.category.findMany({
                orderBy: { label: 'asc' }
            });
            res.json({ categories });
        }
        catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Get project statistics
    static async getStatistics(req, res) {
        try {
            const [totalProjects, projectsByStatus, projectsByCategory, recentProjects] = await Promise.all([
                prismaClient_1.default.project.count(),
                prismaClient_1.default.project.groupBy({
                    by: ['status'],
                    _count: true
                }),
                prismaClient_1.default.project.groupBy({
                    by: ['categoryId'],
                    _count: true
                }),
                prismaClient_1.default.project.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        status: true
                    }
                })
            ]);
            res.json({
                statistics: {
                    totalProjects,
                    projectsByStatus,
                    projectsByCategory,
                    recentProjects
                }
            });
        }
        catch (error) {
            console.error('Get statistics error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.ProjectController = ProjectController;
