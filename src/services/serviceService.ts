// services/serviceService.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { 
  Service,
  ServiceCreateInput,
  ServiceUpdateInput,
  ServiceQueryOptions,
  ServiceWithRelations
} from '../types/services/serviceTypes';
import { IServiceService } from '../types/services/serviceInterfaces';

const prisma = new PrismaClient();

class ServiceService implements IServiceService {
  // Get all services
  async getAllServices(options: ServiceQueryOptions = {}): Promise<ServiceWithRelations[]> {
    const { include, skip, take, orderBy } = options;
    
    try {
      const services = await prisma.service.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { id: 'asc' },
        include: {
          features: include?.features || false,
          technologies: include?.technologies ? {
            include: {
              technology: true
            }
          } : false,
        }
      });
      
      return services;
    } catch (error: any) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }

  // Get service by ID
  async getServiceById(id: number, include: { features?: boolean; technologies?: boolean } = {}): Promise<ServiceWithRelations> {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          features: include.features || false,
          technologies: include.technologies ? {
            include: {
              technology: true
            }
          } : false,
        }
      });

      if (!service) {
        throw new Error('Service not found');
      }

      return service;
    } catch (error: any) {
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  }

  // Get service by title
  async getServiceByTitle(title: string, include: { features?: boolean; technologies?: boolean } = {}): Promise<ServiceWithRelations> {
    try {
      const service = await prisma.service.findFirst({
        where: { 
          title: {
            equals: title,
          }
        },
        include: {
          features: include.features || false,
          technologies: include.technologies ? {
            include: {
              technology: true
            }  
          } : false,
        }
      });

      if (!service) {
        throw new Error('Service not found');
      }

      return service;
    } catch (error: any) {
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  }

  // Create new service
  async createService(data: ServiceCreateInput): Promise<ServiceWithRelations> {
    try {
      const { icon, title, subtitle, description, color, features, technologyIds } = data;

      // Validate required fields
      if (!title || title.trim() === '') {
        throw new Error('Service title is required');
      }

      if (!subtitle || subtitle.trim() === '') {
        throw new Error('Service subtitle is required');
      }

      if (!description || description.trim() === '') {
        throw new Error('Service description is required');
      }

      // Validate technology IDs if provided
      if (technologyIds && technologyIds.length > 0) {
        const existingTechnologies = await prisma.technology.findMany({
          where: {
            id: {
              in: technologyIds
            }
          }
        });

        if (existingTechnologies.length !== technologyIds.length) {
          throw new Error('One or more technology IDs are invalid');
        }
      }

      const service = await prisma.service.create({
        data: {
          icon: icon.trim(),
          title: title.trim(),
          subtitle: subtitle.trim(),
          description: description.trim(),
          color: color.trim(),
          features: features ? {
            create: features.map(feature => ({
              name: feature.trim()
            }))
          } : undefined,
          technologies: technologyIds ? {
            create: technologyIds.map(techId => ({
              technologyId: techId,
              name: '' // This will be updated with actual technology name
            }))
          } : undefined
        },
        include: {
          features: true,
          technologies: {
            include: {
              technology: true
            }
          }
        }
      });

      // Update technology names in ServiceTechnology
      if (technologyIds && technologyIds.length > 0) {
        await Promise.all(
          service.technologies.map(async (serviceTech) => {
            await prisma.serviceTechnology.update({
              where: { id: serviceTech.id },
              data: { name: serviceTech.technology?.name || '' }
            });
          })
        );
      }

      // Fetch the updated service
      return await this.getServiceById(service.id, { features: true, technologies: true });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Service title already exists');
      }
      throw new Error(`Failed to create service: ${error.message}`);
    }
  }

  // Update service
  async updateService(id: number, data: ServiceUpdateInput): Promise<ServiceWithRelations> {
    try {
      const { icon, title, subtitle, description, color, features, technologyIds } = data;

      // Check if service exists
      await this.getServiceById(id);

      // Validate technology IDs if provided
      if (technologyIds && technologyIds.length > 0) {
        const existingTechnologies = await prisma.technology.findMany({
          where: {
            id: {
              in: technologyIds
            }
          }
        });

        if (existingTechnologies.length !== technologyIds.length) {
          throw new Error('One or more technology IDs are invalid');
        }
      }

      // Prepare update data
      const updateData: Prisma.ServiceUpdateInput = {};
      if (icon !== undefined) updateData.icon = icon.trim();
      if (title !== undefined) updateData.title = title.trim();
      if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (color !== undefined) updateData.color = color.trim();

      // Handle features update
      if (features !== undefined) {
        // Delete existing features
        await prisma.serviceFeature.deleteMany({
          where: { serviceId: id }
        });

        // Create new features
        if (features.length > 0) {
          updateData.features = {
            create: features.map(feature => ({
              name: feature.trim()
            }))
          };
        }
      }

      // Handle technologies update
      if (technologyIds !== undefined) {
        // Delete existing service technologies
        await prisma.serviceTechnology.deleteMany({
          where: { serviceId: id }
        });

        // Create new service technologies
        if (technologyIds.length > 0) {
          const technologies = await prisma.technology.findMany({
            where: { id: { in: technologyIds } }
          });

          updateData.technologies = {
            create: technologyIds.map(techId => {
              const tech = technologies.find(t => t.id === techId);
              return {
                technologyId: techId,
                name: tech?.name || ''
              };
            })
          };
        }
      }

      const updatedService = await prisma.service.update({
        where: { id },
        data: updateData,
        include: {
          features: true,
          technologies: {
            include: {
              technology: true
            }
          }
        }
      });

      return updatedService;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Service title already exists');
      }
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to update service: ${error.message}`);
    }
  }

  // Delete service
  async deleteService(id: number): Promise<{ message: string }> {
    try {
      // Check if service exists
      await this.getServiceById(id);

      await prisma.service.delete({
        where: { id }
      });

      return { message: 'Service deleted successfully' };
    } catch (error: any) {
      if (error.message === 'Service not found') {
        throw error;
      }
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  }

  // Search services by title, subtitle, or description
  async searchServices(query: string, options: ServiceQueryOptions = {}): Promise<ServiceWithRelations[]> {
    const { include, skip, take, orderBy } = options;
    
    try {
      const services = await prisma.service.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { subtitle: { contains: query } },
            { description: { contains: query } }
          ]
        },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { title: 'asc' },
        include: {
          features: include?.features || false,
          technologies: include?.technologies ? {
            include: {
              technology: true
            }
          } : false,
        }
      });

      return services;
    } catch (error: any) {
      throw new Error(`Failed to search services: ${error.message}`);
    }
  }

  // Get services count
  async getServicesCount(): Promise<number> {
    try {
      const count = await prisma.service.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count services: ${error.message}`);
    }
  }

  // Get search count
  async getSearchCount(query: string): Promise<number> {
    try {
      const count = await prisma.service.count({
        where: {
          OR: [
            { title: { contains: query } },
            { subtitle: { contains: query } },
            { description: { contains: query } }
          ]
        }
      });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count search results: ${error.message}`);
    }
  }
}

export default new ServiceService();