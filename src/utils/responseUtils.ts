// utils/response.utils.ts
import { Response } from 'express';
import { 
  ApiResponse, 
  PaginationInfo, 
  ErrorResponse 
} from '../types/technology/technologyTypes';

// Success response helper
export const sendSuccessResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  
  res.status(statusCode).json(response);
};

// Paginated success response helper
export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: PaginationInfo,
  message?: string,
  query?: string
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    pagination,
    message,
    query
  };
  
  res.status(200).json(response);
};

// Error response helper
export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: string[]
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    errors
  };
  
  res.status(statusCode).json(response);
};

// Validation error response helper
export const sendValidationErrorResponse = (
  res: Response,
  errors: string[]
): void => {
  sendErrorResponse(res, 'Validation failed', 400, errors);
};

// Not found response helper
export const sendNotFoundResponse = (
  res: Response,
  resource: string = 'Resource'
): void => {
  sendErrorResponse(res, `${resource} not found`, 404);
};

// Conflict response helper
export const sendConflictResponse = (
  res: Response,
  message: string
): void => {
  sendErrorResponse(res, message, 409);
};

// Internal server error response helper
export const sendInternalServerErrorResponse = (
  res: Response,
  message: string = 'Internal server error'
): void => {
  sendErrorResponse(res, message, 500);
};

// Created response helper
export const sendCreatedResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): void => {
  sendSuccessResponse(res, data, message, 201);
};

// No content response helper
export const sendNoContentResponse = (res: Response): void => {
  res.status(204).send();
};

// Parse include options helper
export const parseIncludeOptions = (include?: string): { [key: string]: boolean } => {
  const includeOptions: { [key: string]: boolean } = {};
  
  if (include) {
    const includeArray = include.split(',');
    includeArray.forEach(rel => {
      const trimmedRel = rel.trim();
      if (['projects', 'services'].includes(trimmedRel)) {
        includeOptions[trimmedRel] = true;
      }
    });
  }
  
  return includeOptions;
};

// Parse pagination options helper
export const parsePaginationOptions = (page?: string, limit?: string) => {
  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '10', 10);
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

// Parse sort options helper
export const parseSortOptions = (sort?: string) => {
  if (!sort) return undefined;
  
  const [field, order] = sort.split(':');
  
  if (['id', 'name', 'createdAt'].includes(field)) {
    return {
      [field]: order === 'desc' ? 'desc' : 'asc'
    };
  }
  
  return undefined;
};

// Calculate pagination info helper
export const calculatePagination = (
  total: number,
  page: number,
  limit: number
): PaginationInfo => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

// Handle async controller errors
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Format error message for different error types
export const formatErrorMessage = (error: any): { message: string; statusCode: number } => {
  // Prisma errors
  if (error.code === 'P2002') {
    return {
      message: 'A record with this data already exists',
      statusCode: 409
    };
  }
  
  if (error.code === 'P2025') {
    return {
      message: 'Record not found',
      statusCode: 404
    };
  }
  
  if (error.code === 'P2003') {
    return {
      message: 'Foreign key constraint failed',
      statusCode: 400
    };
  }
  
  // Custom application errors
  if (error.message === 'Technology not found') {
    return {
      message: error.message,
      statusCode: 404
    };
  }
  
  if (error.message.includes('already exists')) {
    return {
      message: error.message,
      statusCode: 409
    };
  }
  
  if (error.message.includes('Cannot delete')) {
    return {
      message: error.message,
      statusCode: 409
    };
  }
  
  // Default error
  return {
    message: error.message || 'Internal server error',
    statusCode: 500
  };
};