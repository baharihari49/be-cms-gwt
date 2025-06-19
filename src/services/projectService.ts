// services/projectService.ts
import prisma from '../prismaClient';

// Import types and constants
import { ProjectStatus } from '../constants/project';
import {
  CreateProjectMetrics,
  CreateProjectLinks,
  CreateProjectImage,
  CreateProjectReview
} from '../types/project';

export interface ProjectQuery {
  page?: number;
  limit?: number;
  category?: string;
  status?: ProjectStatus;
  search?: string;
  sort?: 'createdAt' | 'title' | 'year';
  order?: 'asc' | 'desc';
}

export interface CreateProjectData {
  title: string;
  subtitle: string;
  categoryId: string;
  slug: string;
  type: string;
  description: string;
  image?: string;
  clientId?: number; // Changed from client?: string to clientId?: number
  duration?: string;
  year?: string;
  status?: ProjectStatus;
  icon?: string;
  color?: string;
  technologies?: string[];
  features?: string[];
  metrics?: CreateProjectMetrics;
  links?: CreateProjectLinks;
  images?: CreateProjectImage[];
  reviews?: CreateProjectReview[];
}

export class ProjectService {
  // Get projects with filters and pagination
  static async getProjects(query: ProjectQuery) {
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
          client: true, // Include client data
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
          links: true,
          images: {
            orderBy: { order: 'asc' }
          },
          reviews: {
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.project.count({ where })
    ]);

    return {
      projects: this.transformProjects(projects),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get single project
  static async getProjectById(id: number) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        client: true, // Include client data
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
        links: true,
        images: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return project ? this.transformProject(project) : null;
  }

  // Get single project
  static async getProjectBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        category: true,
        client: true, // Include client data
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
        links: true,
        images: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return project ? this.transformProject(project) : null;
  }

  // Create new project
  static async createProject(data: CreateProjectData) {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new Error('Invalid category');
    }

    // Check if client exists (if clientId is provided)
    if (data.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: data.clientId }
      });

      if (!client) {
        throw new Error('Invalid client');
      }
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        slug: data.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50), // Generate slug
        categoryId: data.categoryId,
        type: data.type,
        description: data.description,
        image: data.image,
        clientId: data.clientId, // Use clientId instead of client
        duration: data.duration,
        year: data.year,
        status: data.status || 'DEVELOPMENT',
        icon: data.icon,
        color: data.color,
        // Create technologies
        technologies: data.technologies ? {
          create: data.technologies.map(tech => ({
            technology: {
              connectOrCreate: {
                where: { name: tech },
                create: { name: tech }
              }
            }
          }))
        } : undefined,
        // Create features
        features: data.features ? {
          create: data.features.map(feat => ({
            feature: {
              connectOrCreate: {
                where: { name: feat },
                create: { name: feat }
              }
            }
          }))
        } : undefined,
        // Create metrics
        metrics: data.metrics ? {
          create: data.metrics
        } : undefined,
        // Create links
        links: data.links ? {
          create: data.links
        } : undefined,
        // Create images
        images: data.images ? {
          create: data.images.map((img, index) => ({
            url: img.url,
            caption: img.caption,
            order: img.order ?? index,
            type: img.type || 'SCREENSHOT'
          }))
        } : undefined,
        // Create reviews
        reviews: data.reviews ? {
          create: data.reviews
        } : undefined
      },
      include: {
        category: true,
        client: true, // Include client data
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
      where: { id: data.categoryId },
      data: { count: { increment: 1 } }
    });

    return this.transformProject(project);
  }

  // Update project
  static async updateProject(id: number, data: Partial<CreateProjectData>) {
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: true,
        features: true
      }
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Check if client exists (if clientId is provided)
    if (data.clientId) {
      const client = await prisma.client.findUnique({
        where: { id: data.clientId }
      });

      if (!client) {
        throw new Error('Invalid client');
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        categoryId: data.categoryId,
        type: data.type,
        description: data.description,
        image: data.image,
        clientId: data.clientId, // Use clientId instead of client
        duration: data.duration,
        year: data.year,
        status: data.status,
        icon: data.icon,
        color: data.color,
        // Update technologies if provided
        technologies: data.technologies ? {
          deleteMany: {},
          create: data.technologies.map(tech => ({
            technology: {
              connectOrCreate: {
                where: { name: tech },
                create: { name: tech }
              }
            }
          }))
        } : undefined,
        // Update features if provided
        features: data.features ? {
          deleteMany: {},
          create: data.features.map(feat => ({
            feature: {
              connectOrCreate: {
                where: { name: feat },
                create: { name: feat }
              }
            }
          }))
        } : undefined,
        // Update metrics if provided
        metrics: data.metrics ? {
          upsert: {
            create: data.metrics,
            update: data.metrics
          }
        } : undefined,
        // Update links if provided
        links: data.links ? {
          upsert: {
            create: data.links,
            update: data.links
          }
        } : undefined,
        // Update images if provided
        images: data.images ? {
          deleteMany: {},
          create: data.images.map((img, index) => ({
            url: img.url,
            caption: img.caption,
            order: img.order ?? index,
            type: img.type || 'SCREENSHOT'
          }))
        } : undefined,
        // Update reviews if provided
        reviews: data.reviews ? {
          deleteMany: {},
          create: data.reviews
        } : undefined
      },
      include: {
        category: true,
        client: true, // Include client data
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
    if (data.categoryId && data.categoryId !== existingProject.categoryId) {
      await Promise.all([
        prisma.category.update({
          where: { id: existingProject.categoryId },
          data: { count: { decrement: 1 } }
        }),
        prisma.category.update({
          where: { id: data.categoryId },
          data: { count: { increment: 1 } }
        })
      ]);
    }

    return this.transformProject(project);
  }

  // Delete project
  static async deleteProject(id: number) {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await prisma.project.delete({
      where: { id }
    });

    // Update category count
    await prisma.category.update({
      where: { id: project.categoryId },
      data: { count: { decrement: 1 } }
    });

    return { message: 'Project deleted successfully' };
  }

  // Get categories
  static async getCategories() {
    return await prisma.category.findMany({
      orderBy: { label: 'asc' }
    });
  }

  // Get clients
  static async getClients() {
    return await prisma.client.findMany({
      orderBy: { name: 'asc' }
    });
  }

  // Get statistics
  static async getStatistics() {
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

    return {
      totalProjects,
      projectsByStatus,
      projectsByCategory,
      recentProjects
    };
  }

  // Add image to project
  static async addProjectImage(projectId: number, imageData: CreateProjectImage) {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Get current max order
    const maxOrder = await prisma.projectImage.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    return await prisma.projectImage.create({
      data: {
        projectId,
        url: imageData.url,
        caption: imageData.caption,
        order: imageData.order ?? ((maxOrder?.order ?? -1) + 1),
        type: imageData.type || 'SCREENSHOT'
      }
    });
  }

  // Delete project image
  static async deleteProjectImage(imageId: number) {
    return await prisma.projectImage.delete({
      where: { id: imageId }
    });
  }

  // Add review to project
  static async addProjectReview(projectId: number, reviewData: CreateProjectReview) {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return await prisma.testimonial.create({
      data: {
        projectId,
        author: reviewData.author,
        role: reviewData.role,
        company: reviewData.company,
        content: reviewData.content,
        rating: reviewData.rating
      }
    });
  }

  // Delete project review
  static async deleteProjectReview(reviewId: number) {
    return await prisma.testimonial.delete({
      where: { id: reviewId }
    });
  }


  // Tambahkan method ini ke dalam class ProjectService

  /**
   * Update project image field menjadi null berdasarkan URL
   * Digunakan ketika image dihapus dari Cloudinary
   * @param imageUrl - URL gambar yang dihapus
   * @returns Informasi tentang update yang dilakukan
   */
  static async updateProjectImageByUrl(imageUrl: string) {
    try {
      // Update semua project yang field image-nya sama dengan imageUrl
      const updateResult = await prisma.project.updateMany({
        where: {
          image: imageUrl
        },
        data: {
          image: null
        }
      });

      // Jika ada project yang diupdate, ambil detail projectnya untuk logging
      let updatedProjects: any[] = [];
      if (updateResult.count > 0) {
        // Karena kita sudah update jadi null, kita perlu query dengan kondisi yang berbeda
        // Ini untuk mendapatkan project yang baru saja diupdate (optional, untuk logging)
        updatedProjects = await prisma.project.findMany({
          where: {
            AND: [
              { image: null },
              {
                OR: [
                  { title: { contains: imageUrl.split('/').pop()?.split('.')[0] || '' } },
                  { updatedAt: { gte: new Date(Date.now() - 5000) } } // 5 detik terakhir
                ]
              }
            ]
          },
          select: {
            id: true,
            title: true,
            slug: true
          },
          take: updateResult.count // Ambil sesuai jumlah yang diupdate
        });
      }

      return {
        success: true,
        updatedCount: updateResult.count,
        updatedProjects: updatedProjects,
        message: `${updateResult.count} project(s) image field updated to null`
      };

    } catch (error: any) {
      console.error('Error updating project image by URL:', error);

      // Return error info tapi jangan throw, biar proses delete tetap jalan
      return {
        success: false,
        updatedCount: 0,
        updatedProjects: [],
        message: 'Failed to update project image field',
        error: error.message
      };
    }
  }

  /**
   * Update project images field menjadi null berdasarkan URL
   * Untuk menghapus image dari array images project
   * @param imageUrl - URL gambar yang dihapus
   * @returns Informasi tentang update yang dilakukan
   */
  static async updateProjectImagesArrayByUrl(imageUrl: string) {
    try {
      // Cari project yang memiliki image dengan URL tersebut di array images
      const projectsWithImage = await prisma.project.findMany({
        where: {
          images: {
            some: {
              url: imageUrl
            }
          }
        },
        include: {
          images: true
        }
      });

      if (projectsWithImage.length === 0) {
        return {
          success: true,
          updatedCount: 0,
          updatedProjects: [],
          message: 'No projects found with this image in images array'
        };
      }

      // Hapus image dari array untuk setiap project
      const updatePromises = projectsWithImage.map(async (project) => {
        // Hapus image dengan URL yang sama
        await prisma.projectImage.deleteMany({
          where: {
            projectId: project.id,
            url: imageUrl
          }
        });

        return {
          id: project.id,
          title: project.title,
          slug: project.slug
        };
      });

      const updatedProjects = await Promise.all(updatePromises);

      return {
        success: true,
        updatedCount: updatedProjects.length,
        updatedProjects: updatedProjects,
        message: `Image removed from ${updatedProjects.length} project(s) images array`
      };

    } catch (error: any) {
      console.error('Error updating project images array by URL:', error);

      return {
        success: false,
        updatedCount: 0,
        updatedProjects: [],
        message: 'Failed to update project images array',
        error: error.message
      };
    }
  }

  /**
   * Comprehensive update untuk semua kemungkinan penggunaan image
   * Akan update baik field image maupun array images
   * @param imageUrl - URL gambar yang dihapus
   * @returns Informasi lengkap tentang semua update yang dilakukan
   */
  static async updateAllProjectImagesByUrl(imageUrl: string) {
    try {
      // Update field image
      const imageFieldUpdate = await this.updateProjectImageByUrl(imageUrl);

      // Update array images
      const imagesArrayUpdate = await this.updateProjectImagesArrayByUrl(imageUrl);

      const totalUpdated = imageFieldUpdate.updatedCount + imagesArrayUpdate.updatedCount;
      const allUpdatedProjects = [
        ...imageFieldUpdate.updatedProjects,
        ...imagesArrayUpdate.updatedProjects
      ];

      return {
        success: imageFieldUpdate.success && imagesArrayUpdate.success,
        updatedCount: totalUpdated,
        updatedProjects: allUpdatedProjects,
        message: `Total ${totalUpdated} project(s) updated`,
        details: {
          imageFieldUpdates: imageFieldUpdate,
          imagesArrayUpdates: imagesArrayUpdate
        }
      };

    } catch (error: any) {
      console.error('Error in comprehensive project image update:', error);

      return {
        success: false,
        updatedCount: 0,
        updatedProjects: [],
        message: 'Failed to update project images',
        error: error.message
      };
    }
  }


  // Transform single project
  private static transformProject(project: any) {
    return {
      ...project,
      technologies: project.technologies?.map((pt: any) => pt.technology.name) || [],
      features: project.features?.map((pf: any) => pf.feature.name) || []
    };
  }

  // Transform multiple projects
  private static transformProjects(projects: any[]) {
    return projects.map(project => this.transformProject(project));
  }
}