import { Response } from 'express';
import { z } from 'zod';

export class ErrorHandler {
  static handleError(error: any, res: Response, context: string = 'Operation') {
    console.error(`${context} error:`, error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }

    if (error instanceof Error) {
      switch (error.message) {
        case 'Project not found':
        case 'Category not found':
        case 'Image not found':
        case 'Review not found':
          return res.status(404).json({
            success: false,
            error: error.message
          });

        case 'Invalid category':
        case 'Invalid project ID':
        case 'Invalid image ID':
        case 'Invalid review ID':
        case 'Invalid slug':
          return res.status(400).json({
            success: false,
            error: error.message
          });

        default:
          return res.status(500).json({
            success: false,
            error: 'Internal server error'
          });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }

  static validateId(id: string | number, paramName: string = 'ID'): number {
    const numericId = typeof id === 'string' ? parseInt(id) : id;

    if (isNaN(numericId)) {
      throw new Error(`Invalid ${paramName}`);
    }

    return numericId;
  }

  static validateSlug(slug: string, paramName: string = 'slug'): string {
    const isValid = /^[a-z0-9-]+$/.test(slug);

    if (!isValid) {
      throw new Error(`Invalid ${paramName}`);
    }

    return slug;
  }
}
