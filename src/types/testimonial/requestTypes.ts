
// Request Types for Testimonial
import { Request } from 'express';
import { TestimonialCreateInput, TestimonialUpdateInput } from './testimonialTypes';

export interface GetAllTestimonialsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
    projectId?: string;
    clientId?: string;
    include?: string;
  };
}

export interface GetTestimonialByIdRequest extends Request {
  params: {
    id: string;
  };
  query: {
    include?: string;
  };
}

export interface CreateTestimonialRequest extends Request {
  body: TestimonialCreateInput;
}

export interface UpdateTestimonialRequest extends Request {
  params: {
    id: string;
  };
  body: TestimonialUpdateInput;
}

export interface DeleteTestimonialRequest extends Request {
  params: {
    id: string;
  };
}

export interface SearchTestimonialRequest extends Request {
  query: {
    q: string;
    page?: string;
    limit?: string;
    sort?: string;
    include?: string;
  };
}