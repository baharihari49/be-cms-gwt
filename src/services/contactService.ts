// services/contactService.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { 
  Contact,
  ContactCreateInput,
  ContactUpdateInput,
  ContactQueryOptions
} from '../types/contact/contact';

const prisma = new PrismaClient();

class ContactService {
  // Get all contacts
  async getAllContacts(options: ContactQueryOptions = {}): Promise<Contact[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const contacts = await prisma.contact.findMany({
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { id: 'asc' }
      });
      
      return contacts.map(contact => ({
        ...contact,
        details: Array.isArray(contact.details) ? contact.details as string[] : []
      }));
    } catch (error: any) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }
  }

  // Get contact by ID
  async getContactById(id: number): Promise<Contact> {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id }
      });

      if (!contact) {
        throw new Error('Contact not found');
      }

      return {
        ...contact,
        details: Array.isArray(contact.details) ? contact.details as string[] : []
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch contact: ${error.message}`);
    }
  }

  // Create new contact
  async createContact(data: ContactCreateInput): Promise<Contact> {
    try {
      const { title, details, color, href } = data;

      // Validate required fields
      if (!title || title.trim() === '') {
        throw new Error('Contact title is required');
      }

      if (!details || details.length === 0) {
        throw new Error('Contact details are required');
      }

      const contact = await prisma.contact.create({
        data: {
          title: title.trim(),
          details: details,
          color: color,
          href: href || null
        }
      });

      return {
        ...contact,
        details: Array.isArray(contact.details) ? contact.details as string[] : []
      };
    } catch (error: any) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }
  }

  // Update contact
  async updateContact(id: number, data: ContactUpdateInput): Promise<Contact> {
    try {
      const { title, details, color, href } = data;

      // Check if contact exists
      await this.getContactById(id);

      const updateData: Prisma.ContactUpdateInput = {};
      if (title !== undefined) updateData.title = title.trim();
      if (details !== undefined) updateData.details = details;
      if (color !== undefined) updateData.color = color;
      if (href !== undefined) updateData.href = href;

      const updatedContact = await prisma.contact.update({
        where: { id },
        data: updateData
      });

      return {
        ...updatedContact,
        details: Array.isArray(updatedContact.details) ? updatedContact.details as string[] : []
      };
    } catch (error: any) {
      throw new Error(`Failed to update contact: ${error.message}`);
    }
  }

  // Delete contact
  async deleteContact(id: number): Promise<{ message: string }> {
    try {
      // Check if contact exists
      await this.getContactById(id);

      await prisma.contact.delete({
        where: { id }
      });

      return { message: 'Contact deleted successfully' };
    } catch (error: any) {
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }

  // Search contacts by title or details
  async searchContacts(query: string, options: ContactQueryOptions = {}): Promise<Contact[]> {
    const { skip, take, orderBy } = options;
    
    try {
      const contacts = await prisma.contact.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { details: { array_contains: query } }
          ]
        },
        skip: skip || 0,
        take: take || undefined,
        orderBy: orderBy || { title: 'asc' }
      });

      return contacts.map(contact => ({
        ...contact,
        details: Array.isArray(contact.details) ? contact.details as string[] : []
      }));
    } catch (error: any) {
      throw new Error(`Failed to search contacts: ${error.message}`);
    }
  }

  // Get contacts count
  async getContactsCount(): Promise<number> {
    try {
      const count = await prisma.contact.count();
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count contacts: ${error.message}`);
    }
  }

  // Get search count
  async getSearchCount(query: string): Promise<number> {
    try {
      const count = await prisma.contact.count({
        where: {
          OR: [
            { title: { contains: query } },
            { details: { array_contains: query } }
          ]
        }
      });
      return count;
    } catch (error: any) {
      throw new Error(`Failed to count search results: ${error.message}`);
    }
  }
}

export default new ContactService();