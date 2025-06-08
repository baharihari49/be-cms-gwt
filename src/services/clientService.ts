// services/clientService.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { 
  Client,
  ClientCreateInput,
  ClientUpdateInput,
  ClientQueryOptions
} from '../types/clients/clientTypes';

const prisma = new PrismaClient();

class ClientService {
  // Get all clients
  async getAllClients(options: ClientQueryOptions = {}): Promise<Client[]> {
    const { skip, take, orderBy, where } = options;
    
    try {
      const clients = await prisma.client.findMany({
        where: where || undefined,
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { id: 'asc' }
      });
      
      return clients;
    } catch (error: any) {
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  // Get client by ID
  async getClientById(id: number): Promise<Client> {
    try {
      const client = await prisma.client.findUnique({
        where: { id }
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return client;
    } catch (error: any) {
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
  }

  // Create new client
  async createClient(data: ClientCreateInput): Promise<Client> {
    try {
      const { name, industry, image, isActive } = data;

      const client = await prisma.client.create({
        data: {
          name: name.trim(),
          industry: industry.trim(),
          image: image || null,
          isActive: isActive !== undefined ? isActive : true
        }
      });

      return client;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Client name already exists');
      }
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  // Update client
  async updateClient(id: number, data: ClientUpdateInput): Promise<Client> {
    try {
      // Check if client exists
      await this.getClientById(id);

      const updateData: Prisma.ClientUpdateInput = {};
      if (data.name !== undefined) updateData.name = data.name.trim();
      if (data.industry !== undefined) updateData.industry = data.industry.trim();
      if (data.image !== undefined) updateData.image = data.image;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const updatedClient = await prisma.client.update({
        where: { id },
        data: updateData
      });

      return updatedClient;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Client name already exists');
      }
      throw new Error(`Failed to update client: ${error.message}`);
    }
  }

  // Delete client
  async deleteClient(id: number): Promise<{ message: string }> {
    try {
      // Check if client exists
      await this.getClientById(id);

      await prisma.client.delete({
        where: { id }
      });

      return { message: 'Client deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  // Search clients
  async searchClients(query: string, options: ClientQueryOptions = {}): Promise<Client[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const clients = await prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { industry: { contains: query } }
          ]
        },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { name: 'asc' }
      });

      return clients;
    } catch (error: any) {
      throw new Error(`Failed to search clients: ${error.message}`);
    }
  }

  // Get clients count
  async getClientsCount(filters: any = {}): Promise<number> {
    try {
      const count = await prisma.client.count({
        where: filters
      });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count clients: ${error.message}`);
    }
  }

  // Get search count
  async getSearchCount(query: string): Promise<number> {
    try {
      const count = await prisma.client.count({
        where: {
          OR: [
            { name: { contains: query } },
            { industry: { contains: query } }
          ]
        }
      });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count search results: ${error.message}`);
    }
  }
}

export default new ClientService();