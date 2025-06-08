// services/testimonialService.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { 
  Testimonial,
  TestimonialCreateInput,
  TestimonialUpdateInput,
  TestimonialQueryOptions
} from '../types/testimonial/testimonialTypes';

const prisma = new PrismaClient();

class TestimonialService {
  // Get all testimonials with optional filters
  async getAllTestimonials(options: TestimonialQueryOptions = {}): Promise<Testimonial[]> {
    const { skip, take, orderBy, projectId, clientId } = options;
    
    try {
      const where: Prisma.TestimonialWhereInput = {};
      if (projectId) where.projectId = projectId;
      if (clientId) where.clientId = clientId;

      const testimonials = await prisma.testimonial.findMany({
        where,
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return testimonials;
    } catch (error: any) {
      throw new Error(`Failed to fetch testimonials: ${error.message}`);
    }
  }

  // Get testimonial by ID
  async getTestimonialById(id: number): Promise<Testimonial> {
    try {
      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      if (!testimonial) {
        throw new Error('Testimonial not found');
      }

      return testimonial;
    } catch (error: any) {
      throw new Error(`Failed to fetch testimonial: ${error.message}`);
    }
  }

  // Create new testimonial
  async createTestimonial(data: TestimonialCreateInput): Promise<Testimonial> {
    try {
      const { author, role, company, content, rating, avatar, projectId, clientId } = data;

      // Validate that project exists if projectId is provided
      if (projectId) {
        const project = await prisma.project.findUnique({
          where: { id: projectId }
        });
        if (!project) {
          throw new Error('Project not found');
        }
      }

      // Validate that client exists if clientId is provided
      if (clientId) {
        const client = await prisma.client.findUnique({
          where: { id: clientId }
        });
        if (!client) {
          throw new Error('Client not found');
        }
      }

      const testimonial = await prisma.testimonial.create({
        data: {
          author: author.trim(),
          role: role?.trim() || null,
          company: company?.trim() || null,
          content: content.trim(),
          rating: rating || null,
          avatar: avatar || null,
          projectId: projectId || null,
          clientId: clientId || null
        },
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return testimonial;
    } catch (error: any) {
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }
  }

  // Update testimonial
  async updateTestimonial(id: number, data: TestimonialUpdateInput): Promise<Testimonial> {
    try {
      // Check if testimonial exists
      await this.getTestimonialById(id);

      // Validate that project exists if projectId is provided
      if (data.projectId) {
        const project = await prisma.project.findUnique({
          where: { id: data.projectId }
        });
        if (!project) {
          throw new Error('Project not found');
        }
      }

      // Validate that client exists if clientId is provided
      if (data.clientId) {
        const client = await prisma.client.findUnique({
          where: { id: data.clientId }
        });
        if (!client) {
          throw new Error('Client not found');
        }
      }

      // Build update data using Prisma's native types to avoid conflicts
      const updateData: Prisma.TestimonialUpdateInput = {};
      
      if (data.author !== undefined) updateData.author = data.author.trim();
      if (data.role !== undefined) updateData.role = data.role?.trim() || null;
      if (data.company !== undefined) updateData.company = data.company?.trim() || null;
      if (data.content !== undefined) updateData.content = data.content.trim();
      if (data.rating !== undefined) updateData.rating = data.rating;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      
      // Handle projectId using connect/disconnect pattern to avoid type conflicts
      if (data.projectId !== undefined) {
        if (data.projectId === null) {
          updateData.project = { disconnect: true };
        } else {
          updateData.project = { connect: { id: data.projectId } };
        }
      }
      
      // Handle clientId using connect/disconnect pattern to avoid type conflicts
      if (data.clientId !== undefined) {
        if (data.clientId === null) {
          updateData.client = { disconnect: true };
        } else {
          updateData.client = { connect: { id: data.clientId } };
        }
      }

      const updatedTestimonial = await prisma.testimonial.update({
        where: { id },
        data: updateData,
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return updatedTestimonial;
    } catch (error: any) {
      throw new Error(`Failed to update testimonial: ${error.message}`);
    }
  }

  // Delete testimonial
  async deleteTestimonial(id: number): Promise<{ message: string }> {
    try {
      // Check if testimonial exists
      await this.getTestimonialById(id);

      await prisma.testimonial.delete({
        where: { id }
      });

      return { message: 'Testimonial deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
  }

  // Search testimonials
  async searchTestimonials(query: string, options: TestimonialQueryOptions = {}): Promise<Testimonial[]> {
    const { skip, take, orderBy, projectId, clientId } = options;
    
    try {
      const where: Prisma.TestimonialWhereInput = {
        AND: [
          // Search filters
          {
            OR: [
              { author: { contains: query } },
              { company: { contains: query } },
              { content: { contains: query } },
              { role: { contains: query } }
            ]
          },
          // Additional filters
          ...(projectId ? [{ projectId }] : []),
          ...(clientId ? [{ clientId }] : [])
        ]
      };

      const testimonials = await prisma.testimonial.findMany({
        where,
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return testimonials;
    } catch (error: any) {
      throw new Error(`Failed to search testimonials: ${error.message}`);
    }
  }

  // Get testimonials by project
  async getTestimonialsByProject(projectId: number, options: TestimonialQueryOptions = {}): Promise<Testimonial[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { projectId },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return testimonials;
    } catch (error: any) {
      throw new Error(`Failed to fetch testimonials for project: ${error.message}`);
    }
  }

  // Get testimonials by client
  async getTestimonialsByClient(clientId: number, options: TestimonialQueryOptions = {}): Promise<Testimonial[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: { clientId },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return testimonials;
    } catch (error: any) {
      throw new Error(`Failed to fetch testimonials for client: ${error.message}`);
    }
  }

  // Get testimonials count
  async getTestimonialsCount(filters: { projectId?: number; clientId?: number } = {}): Promise<number> {
    try {
      const where: Prisma.TestimonialWhereInput = {};
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.clientId) where.clientId = filters.clientId;

      const count = await prisma.testimonial.count({ where });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count testimonials: ${error.message}`);
    }
  }

  // Get search count
  async getSearchCount(query: string, filters: { projectId?: number; clientId?: number } = {}): Promise<number> {
    try {
      const where: Prisma.TestimonialWhereInput = {
        AND: [
          // Search filters
          {
            OR: [
              { author: { contains: query } },
              { company: { contains: query } },
              { content: { contains: query } },
              { role: { contains: query } }
            ]
          },
          // Additional filters
          ...(filters.projectId ? [{ projectId: filters.projectId }] : []),
          ...(filters.clientId ? [{ clientId: filters.clientId }] : [])
        ]
      };

      const count = await prisma.testimonial.count({ where });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count search results: ${error.message}`);
    }
  }

  // Get testimonials statistics
  async getTestimonialsStats(): Promise<{
    total: number;
    withProjects: number;
    withClients: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  }> {
    try {
      const [
        total,
        withProjects,
        withClients,
        ratingsData
      ] = await Promise.all([
        prisma.testimonial.count(),
        prisma.testimonial.count({
          where: { projectId: { not: null } }
        }),
        prisma.testimonial.count({
          where: { clientId: { not: null } }
        }),
        prisma.testimonial.findMany({
          where: { rating: { not: null } },
          select: { rating: true }
        })
      ]);

      // Calculate average rating
      const validRatings = ratingsData.filter(t => t.rating !== null).map(t => t.rating!);
      const averageRating = validRatings.length > 0 
        ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length 
        : 0;

      // Calculate rating distribution
      const ratingCounts = validRatings.reduce((acc, rating) => {
        const roundedRating = Math.floor(rating);
        acc[roundedRating] = (acc[roundedRating] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const ratingDistribution = Object.entries(ratingCounts)
        .map(([rating, count]) => ({ rating: Number(rating), count }))
        .sort((a, b) => a.rating - b.rating);

      return {
        total,
        withProjects,
        withClients,
        averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
        ratingDistribution
      };
    } catch (error: any) {
      throw new Error(`Failed to get testimonials statistics: ${error.message}`);
    }
  }

  // Get featured testimonials (highest rated or most recent)
  async getFeaturedTestimonials(limit: number = 5): Promise<Testimonial[]> {
    try {
      const testimonials = await prisma.testimonial.findMany({
        where: {
          rating: { gte: 4 } // Only testimonials with rating >= 4
        },
        orderBy: [
          { rating: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        include: {
          project: {
            select: {
              id: true,
              title: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return testimonials;
    } catch (error: any) {
      throw new Error(`Failed to fetch featured testimonials: ${error.message}`);
    }
  }
}

export default new TestimonialService();