// Request Types for Client
import { Request } from 'express';
import { ClientCreateInput, ClientUpdateInput } from './clientTypes';

export interface GetAllClientsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
    industry?: string;
    isActive?: string;
  };
}

export interface GetClientByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateClientRequest extends Request {
  body: ClientCreateInput;
}

export interface UpdateClientRequest extends Request {
  params: {
    id: string;
  };
  body: ClientUpdateInput;
}

export interface DeleteClientRequest extends Request {
  params: {
    id: string;
  };
}

export interface SearchClientRequest extends Request {
  query: {
    q: string;
    page?: string;
    limit?: string;
    sort?: string;
  };
}