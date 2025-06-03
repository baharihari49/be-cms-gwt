// controllers/projectController.ts
import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prismaClient';
import { AuthRequest } from '../types/auth';

// Validation schemas
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  categoryId: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
  year: z.string().optional(),
  status: z.enum(['DEVELOPMENT', 'BETA', 'LIVE', 'ARCHIVED', 'MAINTENANCE']).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  metrics: z.object({
    users: z.string().optional(),
    performance: z.string().optional(),
    rating: z.string().optional(),
    downloads: z.string().optional(),
    revenue: z.string().optional(),
    uptime: z.string().optional()
  }).optional(),
  links: z.object({
    live: z.string().url().optional(),
    github: z.string().url().optional(),
    case: z.string().optional(),
    demo: z.string().url().optional(),
    docs: z.string().url().optional()
  }).optional()
});

const updateProjectSchema = createProjectSchema.partial();

const querySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  category: z.string().optional(),
  status: z.enum(['DEVELOPMENT', 'BETA', 'LIVE', 'ARCHIVED', 'MAINTENANCE']).optional(),
  search: z.string().optional(),
  sort: z.enum(['createdAt', 'title', 'year']).optional(),
  order: z.enum(['asc', 'desc']).optional()
});

export class ProjectController {
  // Get all projects with filters
  static async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const query = querySchema.parse(req.query);
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      if (query.category) where.categoryId = query.category;
      if (query.status) where.status = query.status;
      if (query.search) {
        where.OR = [
          { title: { contains: query.search, mode: 'insensitive' } },
          { subtitle: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      // Get projects with relations
      const [projects, total] = await Promise.all([
        prisma.project.findMany({
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
        prisma.project.count({ where })
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
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  static async getProject(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const project = await prisma.project.findUnique({
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
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create project (Admin only)
  static async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validatedData = createProjectSchema.parse(req.body);

      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId }
      });

      if (!category) {
        res.status(400).json({ error: 'Invalid category' });
        return;
      }

      // Create project with relations
      const project = await prisma.project.create({
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
      await prisma.category.update({
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
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  static async updateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateProjectSchema.parse(req.body);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      // Check if project exists
      const existingProject = await prisma.project.findUnique({
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
      const project = await prisma.project.update({
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
          prisma.category.update({
            where: { id: existingProject.categoryId },
            data: { count: { decrement: 1 } }
          }),
          prisma.category.update({
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
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  static async deleteProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const project = await prisma.project.findUnique({
        where: { id }
      });

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Delete project (cascade will handle relations)
      await prisma.project.delete({
        where: { id }
      });

      // Update category count
      await prisma.category.update({
        where: { id: project.categoryId },
        data: { count: { decrement: 1 } }
      });

      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get all categories
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { label: 'asc' }
      });

      res.json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get project statistics
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const [totalProjects, projectsByStatus, projectsByCategory, recentProjects] = await Promise.all([
        prisma.project.count(),
        prisma.project.groupBy({
          by: ['status'],
          _count: true
        }),
        prisma.project.groupBy({
          by: ['categoryId'],
          _count: true
        }),
        prisma.project.findMany({
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
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}