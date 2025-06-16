// services/teamMemberService.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { 
  TeamMember,
  TeamMemberCreateInput,
  TeamMemberUpdateInput,
  TeamMemberQueryOptions
} from '../types/teamMember/teamMemberTypes';
import { ITeamMemberService } from '../types/teamMember/serviceTypes';

const prisma = new PrismaClient();

class TeamMemberService implements ITeamMemberService {
  // Get all team members
  async getAllTeamMembers(options: TeamMemberQueryOptions = {}): Promise<TeamMember[]> {
    const { skip, take, orderBy, where } = options;
    
    try {
      const teamMembers = await prisma.teamMember.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { id: 'asc' },
        where: where
      });
      
      return teamMembers;
    } catch (error: any) {
      throw new Error(`Failed to fetch team members: ${error.message}`);
    }
  }

  // Get team member by ID
  async getTeamMemberById(id: number): Promise<TeamMember> {
    try {
      const teamMember = await prisma.teamMember.findUnique({
        where: { id }
      });

      if (!teamMember) {
        throw new Error('Team member not found');
      }

      return teamMember;
    } catch (error: any) {
      throw new Error(`Failed to fetch team member: ${error.message}`);
    }
  }

  // Get team member by name
  async getTeamMemberByName(name: string): Promise<TeamMember> {
    try {
      const teamMember = await prisma.teamMember.findFirst({
        where: { 
          name: {
            equals: name,
          }
        }
      });

      if (!teamMember) {
        throw new Error('Team member not found');
      }

      return teamMember;
    } catch (error: any) {
      throw new Error(`Failed to fetch team member: ${error.message}`);
    }
  }

  // Get team members by department
  async getTeamMembersByDepartment(department: string, options: TeamMemberQueryOptions = {}): Promise<TeamMember[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const teamMembers = await prisma.teamMember.findMany({
        where: {
          department: {
            equals: department,
          }
        },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { name: 'asc' }
      });
      
      return teamMembers;
    } catch (error: any) {
      throw new Error(`Failed to fetch team members by department: ${error.message}`);
    }
  }

  // Create new team member
  async createTeamMember(data: TeamMemberCreateInput): Promise<TeamMember> {
    try {
      const { 
        name, 
        position, 
        department, 
        bio, 
        avatar, 
        skills, 
        experience, 
        projects, 
        speciality, 
        social, 
        gradient, 
        icon, 
        achievements 
      } = data;

      // Validate required fields
      if (!name || name.trim() === '') {
        throw new Error('Team member name is required');
      }

      if (!position || position.trim() === '') {
        throw new Error('Team member position is required');
      }

      if (!department || department.trim() === '') {
        throw new Error('Team member department is required');
      }

      const teamMember = await prisma.teamMember.create({
        data: {
          name: name.trim(),
          position: position.trim(),
          department: department.trim(),
          bio: bio.trim(),
          avatar: avatar.trim(),
          skills: skills, // JSON field
          experience: experience.trim(),
          projects: projects.trim(),
          speciality: speciality.trim(),
          social: social, // JSON field
          gradient: gradient.trim(),
          icon: icon.trim(),
          achievements: achievements || [] // JSON field
        }
      });

      return teamMember;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Team member with this name already exists');
      }
      throw new Error(`Failed to create team member: ${error.message}`);
    }
  }

  // Update team member
  async updateTeamMember(id: number, data: TeamMemberUpdateInput): Promise<TeamMember> {
    try {
      // Check if team member exists
      await this.getTeamMemberById(id);

      const updateData: Prisma.TeamMemberUpdateInput = {};
      
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.position !== undefined) updateData.position = data.position.trim();
      if (data.department !== undefined) updateData.department = data.department.trim();
      if (data.bio !== undefined) updateData.bio = data.bio.trim();
      if (data.avatar !== undefined) updateData.avatar = data.avatar.trim();
      if (data.skills !== undefined) updateData.skills = data.skills;
      if (data.experience !== undefined) updateData.experience = data.experience.trim();
      if (data.projects !== undefined) updateData.projects = data.projects.trim();
      if (data.speciality !== undefined) updateData.speciality = data.speciality.trim();
      if (data.social !== undefined) updateData.social = data.social;
      if (data.gradient !== undefined) updateData.gradient = data.gradient.trim();
      if (data.icon !== undefined) updateData.icon = data.icon.trim();
      if (data.achievements !== undefined) updateData.achievements = data.achievements;

      const updatedTeamMember = await prisma.teamMember.update({
        where: { id },
        data: updateData
      });

      return updatedTeamMember;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Team member with this name already exists');
      }
      throw new Error(`Failed to update team member: ${error.message}`);
    }
  }

  // Delete team member
  async deleteTeamMember(id: number): Promise<{ message: string }> {
    try {
      // Check if team member exists
      await this.getTeamMemberById(id);

      await prisma.teamMember.delete({
        where: { id }
      });

      return { message: 'Team member deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete team member: ${error.message}`);
    }
  }

  // Search team members by name, position, department, bio, or speciality
  async searchTeamMembers(query: string, options: TeamMemberQueryOptions = {}): Promise<TeamMember[]> {
    const { skip, take, orderBy, where } = options;
    
    try {
      const searchWhere = {
        OR: [
          { name: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
          { position: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
          { department: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
          { bio: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
          { speciality: { contains: query, mode: 'insensitive' as Prisma.QueryMode } }
        ],
        ...where
      };
      
      const teamMembers = await prisma.teamMember.findMany({
        where: searchWhere,
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { name: 'asc' }
      });

      return teamMembers;
    } catch (error: any) {
      throw new Error(`Failed to search team members: ${error.message}`);
    }
  }

  // Get team members count
  async getTeamMembersCount(filters: { department?: string; position?: string; speciality?: string } = {}): Promise<number> {
    try {
      const where: any = {};
      
      if (filters.department) {
        where.department = { equals: filters.department, mode: 'insensitive' };
      }
      if (filters.position) {
        where.position = { equals: filters.position, mode: 'insensitive' };
      }
      if (filters.speciality) {
        where.speciality = { equals: filters.speciality, mode: 'insensitive' };
      }

      const count = await prisma.teamMember.count({ where });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count team members: ${error.message}`);
    }
  }

  // Get search count
  async getSearchCount(query: string, filters: { department?: string; position?: string; speciality?: string } = {}): Promise<number> {
    try {
      const where: any = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { position: { contains: query, mode: 'insensitive' } },
          { department: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
          { speciality: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (filters.department) {
        where.department = { equals: filters.department, mode: 'insensitive' };
      }
      if (filters.position) {
        where.position = { equals: filters.position, mode: 'insensitive' };
      }
      if (filters.speciality) {
        where.speciality = { equals: filters.speciality, mode: 'insensitive' };
      }

      const count = await prisma.teamMember.count({ where });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count search results: ${error.message}`);
    }
  }

  // Get unique departments
  async getUniqueDepartments(): Promise<string[]> {
    try {
      const departments = await prisma.teamMember.findMany({
        select: { department: true },
        distinct: ['department'],
        orderBy: { department: 'asc' }
      });
      
      return departments.map(d => d.department);
    } catch (error: any) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }
  }

  // Get unique positions
  async getUniquePositions(): Promise<string[]> {
    try {
      const positions = await prisma.teamMember.findMany({
        select: { position: true },
        distinct: ['position'],
        orderBy: { position: 'asc' }
      });
      
      return positions.map(p => p.position);
    } catch (error: any) {
      throw new Error(`Failed to fetch positions: ${error.message}`);
    }
  }

  // Get unique specialities
  async getUniqueSpecialities(): Promise<string[]> {
    try {
      const specialities = await prisma.teamMember.findMany({
        select: { speciality: true },
        distinct: ['speciality'],
        orderBy: { speciality: 'asc' }
      });
      
      return specialities.map(s => s.speciality);
    } catch (error: any) {
      throw new Error(`Failed to fetch specialities: ${error.message}`);
    }
  }
}

export default new TeamMemberService();