// src/types/email/email.ts

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  details?: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  data: {
    adminEmailId?: string;
    customerEmailId?: string;
    timestamp: string;
  };
}

export interface HealthResponse {
  message: string;
  status: string;
  timestamp: string;
}

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export interface CustomerEmailData {
  name: string;
  email: string;
  service?: string;
  timeline?: string;
  budget?: string;
}

// Resend API types based on actual library
export interface ResendEmailData {
  id: string;
}

export interface ResendErrorResponse {
  message: string;
  name: string;
}

export interface ResendSuccessResponse {
  data: ResendEmailData;
  error: null;
}

export interface ResendErrorResponseComplete {
  data: null;
  error: ResendErrorResponse;
}

export type ResendResponse = ResendSuccessResponse | ResendErrorResponseComplete;

// Our custom email response type
export interface EmailResponse {
  success: boolean;
  data?: {
    id: string;
  };
  error?: string;
}

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}