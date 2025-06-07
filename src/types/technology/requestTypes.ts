// types/request.types.ts
import { Request } from 'express';

// Base query parameters interface
export interface BaseQueryParams {
  page?: string;
  limit?: string;
  include?: string;
  sort?: string;
}

// Technology specific query parameters
export interface TechnologyQueryParams extends BaseQueryParams {
  q?: string; // for search
}

// Technology request body
export interface TechnologyRequestBody {
  name?: string;
  icon?: string;
  description?: string;
}

// Technology route parameters with index signature
export interface TechnologyParams {
  id?: string;
  name?: string;
  [key: string]: string | undefined; // Add index signature for Express compatibility
}

// Extended Request interfaces using proper generics
export interface TechnologyRequest<
  P = TechnologyParams,
  ResBody = any,
  ReqBody = TechnologyRequestBody,
  ReqQuery = TechnologyQueryParams
> extends Request<P, ResBody, ReqBody, ReqQuery> {}

// Specific request types for different endpoints using generics
export interface GetTechnologyByIdRequest extends Request<
  { id: string },
  any,
  any,
  { include?: string }
> {}

export interface GetTechnologyByNameRequest extends Request<
  { name: string },
  any,
  any,
  { include?: string }
> {}

export interface CreateTechnologyRequest extends Request<
  {},
  any,
  {
    name: string;
    icon?: string;
    description?: string;
  },
  any
> {}

export interface UpdateTechnologyRequest extends Request<
  { id: string },
  any,
  {
    name?: string;
    icon?: string;
    description?: string;
  },
  any
> {}

export interface DeleteTechnologyRequest extends Request<
  { id: string },
  any,
  any,
  any
> {}

export interface SearchTechnologyRequest extends Request<
  {},
  any,
  any,
  {
    q: string;
    page?: string;
    limit?: string;
    include?: string;
    sort?: string;
  }
> {}

export interface GetAllTechnologiesRequest extends Request<
  {},
  any,
  any,
  {
    page?: string;
    limit?: string;
    include?: string;
    sort?: string;
  }
> {}

// Alternative: Type aliases for simpler usage
export type TechByIdRequest = Request<{ id: string }, any, any, { include?: string }>;
export type TechByNameRequest = Request<{ name: string }, any, any, { include?: string }>;
export type TechCreateRequest = Request<{}, any, { name: string; icon?: string; description?: string }, any>;
export type TechUpdateRequest = Request<{ id: string }, any, { name?: string; icon?: string; description?: string }, any>;
export type TechDeleteRequest = Request<{ id: string }, any, any, any>;
export type TechSearchRequest = Request<{}, any, any, { q: string; page?: string; limit?: string; include?: string; sort?: string }>;
export type TechListRequest = Request<{}, any, any, { page?: string; limit?: string; include?: string; sort?: string }>;