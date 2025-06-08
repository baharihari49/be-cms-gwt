// types/service/serviceTypes.ts
import { ServiceWithRelations, ServiceCreateInput, ServiceUpdateInput, ServiceQueryOptions } from './serviceTypes';

export interface IServiceService {
  getAllServices(options?: ServiceQueryOptions): Promise<ServiceWithRelations[]>;
  getServiceById(id: number, include?: { features?: boolean; technologies?: boolean }): Promise<ServiceWithRelations>;
  getServiceByTitle(title: string, include?: { features?: boolean; technologies?: boolean }): Promise<ServiceWithRelations>;
  createService(data: ServiceCreateInput): Promise<ServiceWithRelations>;
  updateService(id: number, data: ServiceUpdateInput): Promise<ServiceWithRelations>;
  deleteService(id: number): Promise<{ message: string }>;
  searchServices(query: string, options?: ServiceQueryOptions): Promise<ServiceWithRelations[]>;
  getServicesCount(): Promise<number>;
  getSearchCount(query: string): Promise<number>;
}