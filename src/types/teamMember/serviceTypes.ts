// types/teamMember/serviceTypes.ts
import { 
  TeamMember, 
  TeamMemberCreateInput, 
  TeamMemberUpdateInput, 
  TeamMemberQueryOptions 
} from './teamMemberTypes';

export interface ITeamMemberService {
  // Get all team members
  getAllTeamMembers(options?: TeamMemberQueryOptions): Promise<TeamMember[]>;
  
  // Get team member by ID
  getTeamMemberById(id: number): Promise<TeamMember>;
  
  // Get team member by name
  getTeamMemberByName(name: string): Promise<TeamMember>;
  
  // Get team members by department
  getTeamMembersByDepartment(department: string, options?: TeamMemberQueryOptions): Promise<TeamMember[]>;
  
  // Create new team member
  createTeamMember(data: TeamMemberCreateInput): Promise<TeamMember>;
  
  // Update team member
  updateTeamMember(id: number, data: TeamMemberUpdateInput): Promise<TeamMember>;
  
  // Delete team member
  deleteTeamMember(id: number): Promise<{ message: string }>;
  
  // Search team members
  searchTeamMembers(query: string, options?: TeamMemberQueryOptions): Promise<TeamMember[]>;
  
  // Get team members count
  getTeamMembersCount(filters?: { department?: string; position?: string; speciality?: string }): Promise<number>;
  
  // Get search count
  getSearchCount(query: string, filters?: { department?: string; position?: string; speciality?: string }): Promise<number>;
  
  // Get unique departments
  getUniqueDepartments(): Promise<string[]>;
  
  // Get unique positions
  getUniquePositions(): Promise<string[]>;
  
  // Get unique specialities
  getUniqueSpecialities(): Promise<string[]>;
}