// types/contactTypes.ts
export interface Contact {
  id: number;
  title: string;
  details: string[];
  color: string;
  href: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactCreateInput {
  title: string;
  details: string[];
  color: string;
  href?: string | null;
}

export interface ContactUpdateInput {
  title?: string;
  details?: string[];
  color?: string;
  href?: string | null;
}

export interface ContactQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: any;
}

// Import Express Request type
import { Request } from 'express';

// Request types with proper Express Request extension
export interface GetContactByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateContactRequest extends Request {
  body: ContactCreateInput;
}

export interface UpdateContactRequest extends Request {
  params: {
    id: string;
  };
  body: ContactUpdateInput;
}

export interface DeleteContactRequest extends Request {
  params: {
    id: string;
  };
}

export interface SearchContactRequest extends Request {
  query: {
    q: string;
    page?: string;
    limit?: string;
    sort?: string;
  };
}

export interface GetAllContactsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
  };
}