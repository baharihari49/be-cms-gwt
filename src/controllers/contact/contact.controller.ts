// controllers/contact.controller.ts
import { Request, Response } from 'express';
import contactService from '../../services/contactService';
import {
  createContactSchema,
  updateContactSchema,
  getContactByIdSchema,
  deleteContactSchema,
  searchContactSchema,
  getAllContactsSchema,
  formatZodError
} from '../../schemas/contactSchema';
import { ZodError } from 'zod';
import {
  sendSuccessResponse,
  sendCreatedResponse,
  sendPaginatedResponse,
  sendErrorResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class ContactController {
  // GET /api/contacts
  async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      const validatedQuery = getAllContactsSchema.parse({ query: req.query });
      const { page, limit, sort } = validatedQuery.query;
      
      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'title'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const contacts = await contactService.getAllContacts(options);
      const total = await contactService.getContactsCount();

      sendPaginatedResponse(res, contacts, {
        page: pageNum,
        limit: limitNum,
        total: total,
        pages: Math.ceil(total / limitNum)
      });

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/contacts/:id
  async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = getContactByIdSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const contact = await contactService.getContactById(id);
      sendSuccessResponse(res, contact);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/contacts/search
  async searchContacts(req: Request, res: Response): Promise<void> {
    try {
      const validatedQuery = searchContactSchema.parse({ query: req.query });
      const { q, page, limit, sort } = validatedQuery.query;

      const pageNum = page || 1;
      const limitNum = limit || 10;
      const skip = (pageNum - 1) * limitNum;

      let orderBy: any = undefined;
      if (sort) {
        const [field, order] = sort.split(':');
        if (['id', 'title'].includes(field)) {
          orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
        }
      }

      const options = {
        skip: skip,
        take: limitNum,
        orderBy: orderBy
      };

      const contacts = await contactService.searchContacts(q, options);
      const total = await contactService.getSearchCount(q);

      const response = {
        success: true,
        data: contacts,
        query: q,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: total,
          pages: Math.ceil(total / limitNum)
        }
      };

      res.status(200).json(response);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // POST /api/contacts
  async createContact(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createContactSchema.parse({ body: req.body });
      const { title, details, color, href } = validatedData.body;

      const contactData = {
        title: title.trim(),
        details: details,
        color: color,
        href: href || null
      };

      const contact = await contactService.createContact(contactData);
      sendCreatedResponse(res, contact, 'Contact created successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // PUT /api/contacts/:id
  async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = updateContactSchema.parse({
        params: req.params,
        body: req.body
      });

      const { id } = validatedData.params;
      const updateData = validatedData.body;

      const cleanUpdateData: any = {};
      if (updateData.title !== undefined) cleanUpdateData.title = updateData.title.trim();
      if (updateData.details !== undefined) cleanUpdateData.details = updateData.details;
      if (updateData.color !== undefined) cleanUpdateData.color = updateData.color;
      if (updateData.href !== undefined) cleanUpdateData.href = updateData.href || null;

      const contact = await contactService.updateContact(id, cleanUpdateData);
      sendSuccessResponse(res, contact, 'Contact updated successfully');

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }

  // DELETE /api/contacts/:id
  async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = deleteContactSchema.parse({ params: req.params });
      const { id } = validatedData.params;

      const result = await contactService.deleteContact(id);
      sendSuccessResponse(res, null, result.message);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodError(error);
        sendErrorResponse(res, 'Validation failed', 400, formattedErrors.map(err => `${err.field}: ${err.message}`));
        return;
      }

      const { message, statusCode } = formatErrorMessage(error);
      sendErrorResponse(res, message, statusCode);
    }
  }
}

export default new ContactController();