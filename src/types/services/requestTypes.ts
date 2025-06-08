// types/service/requestTypes.ts
import { Request } from 'express';

export interface ServiceRequest extends Request {
  // Base service request interface
}

export interface GetAllServicesRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    include?: string;
    sort?: string;
  };
}

export interface GetServiceByIdRequest extends Request {
  params: {
    id: string;
  };
  query: {
    include?: string;
  };
}

export interface GetServiceByTitleRequest extends Request {
  params: {
    title: string;
  };
  query: {
    include?: string;
  };
}

export interface CreateServiceRequest extends Request {
  body: {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    color: string;
    features?: string[];
    technologyIds?: number[];
  };
}

export interface UpdateServiceRequest extends Request {
  params: {
    id: string;
  };
  body: {
    icon?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    color?: string;
    features?: string[];
    technologyIds?: number[];
  };
}

export interface DeleteServiceRequest extends Request {
  params: {
    id: string;
  };
}

export interface SearchServiceRequest extends Request {
  query: {
    q: string;
    page?: string;
    limit?: string;
    include?: string;
    sort?: string;
  };
}