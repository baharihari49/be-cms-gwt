// services/technologyService.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { 
  Technology,
  TechnologyCreateInput,
  TechnologyUpdateInput,
  TechnologyQueryOptions,
  TechnologyWithRelations
} from '../types/technology/technologyTypes';
import { ITechnologyService } from '../types/technology/serviceTypes';

const prisma = new PrismaClient();

class TechnologyService implements ITechnologyService {
  // Get all technologies
  async getAllTechnologies(options: TechnologyQueryOptions = {}): Promise<TechnologyWithRelations[]> {
    const { include, skip, take, orderBy } = options;
    
    try {
      const technologies = await prisma.technology.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { id: 'asc' },
        include: {
          projects: include?.projects || false,
          services: include?.services || false,
        }
      });
      
      return technologies;
    } catch (error: any) {
      throw new Error(`Failed to fetch technologies: ${error.message}`);
    }
  }

  // Get technology by ID
  async getTechnologyById(id: number, include: { projects?: boolean; services?: boolean } = {}): Promise<TechnologyWithRelations> {
    try {
      const technology = await prisma.technology.findUnique({
        where: { id },
        include: {
          projects: include.projects || false,
          services: include.services || false,
        }
      });

      if (!technology) {
        throw new Error('Technology not found');
      }

      return technology;
    } catch (error: any) {
      throw new Error(`Failed to fetch technology: ${error.message}`);
    }
  }

  // Get technology by name
  async getTechnologyByName(name: string, include: { projects?: boolean; services?: boolean } = {}): Promise<TechnologyWithRelations> {
    try {
      const technology = await prisma.technology.findUnique({
        where: { name },
        include: {
          projects: include.projects || false,
          services: include.services || false,
        }
      });

      if (!technology) {
        throw new Error('Technology not found');
      }

      return technology;
    } catch (error: any) {
      throw new Error(`Failed to fetch technology: ${error.message}`);
    }
  }

  // Create new technology
  async createTechnology(data: TechnologyCreateInput): Promise<Technology> {
    try {
      const { name, icon, description } = data;

      // Validate required fields
      if (!name || name.trim() === '') {
        throw new Error('Technology name is required');
      }

      const technology = await prisma.technology.create({
        data: {
          name: name.trim(),
          icon: icon || null,
          description: description || null
        }
      });

      return technology;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Technology name already exists');
      }
      throw new Error(`Failed to create technology: ${error.message}`);
    }
  }

  // Update technology
  async updateTechnology(id: number, data: TechnologyUpdateInput): Promise<Technology> {
    try {
      const { name, icon, description } = data;

      // Check if technology exists
      await this.getTechnologyById(id);

      const updateData: Prisma.TechnologyUpdateInput = {};
      if (name !== undefined) updateData.name = name.trim();
      if (icon !== undefined) updateData.icon = icon;
      if (description !== undefined) updateData.description = description;

      const updatedTechnology = await prisma.technology.update({
        where: { id },
        data: updateData
      });

      return updatedTechnology;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Technology name already exists');
      }
      throw new Error(`Failed to update technology: ${error.message}`);
    }
  }

  // Delete technology
  async deleteTechnology(id: number): Promise<{ message: string }> {
    try {
      // Check if technology exists
      await this.getTechnologyById(id);

      // Check if technology has relations
      const technology = await prisma.technology.findUnique({
        where: { id },
        include: {
          projects: true,
          services: true
        }
      });

      if (!technology) {
        throw new Error('Technology not found');
      }

      if (technology.projects.length > 0 || technology.services.length > 0) {
        throw new Error('Cannot delete technology that is being used in projects or services');
      }

      await prisma.technology.delete({
        where: { id }
      });

      return { message: 'Technology deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete technology: ${error.message}`);
    }
  }

  // Search technologies by name
  async searchTechnologies(query: string, options: TechnologyQueryOptions = {}): Promise<TechnologyWithRelations[]> {
    const { include, skip, take, orderBy } = options;
    
    try {
      const technologies = await prisma.technology.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } }
          ]
        },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { name: 'asc' },
        include: {
          projects: include?.projects || false,
          services: include?.services || false,
        }
      });

      return technologies;
    } catch (error: any) {
      throw new Error(`Failed to search technologies: ${error.message}`);
    }
  }

  // Get technologies count
  async getTechnologiesCount(): Promise<number> {
    try {
      const count = await prisma.technology.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count technologies: ${error.message}`);
    }
  }

  // Get search count
  async getSearchCount(query: string): Promise<number> {
    try {
      const count = await prisma.technology.count({
        where: {
          OR: [
            { name: { contains: query } },
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

export default new TechnologyService();