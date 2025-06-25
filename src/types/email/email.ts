// types/email/email.ts

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

// Generic API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  details?: string;
}

// Contact API Response interface
export interface ContactApiResponse {
  success: boolean;
  message: string;
  data: {
    adminEmailId?: string;
    customerEmailId?: string;
    timestamp: string;
  };
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

// Mailgun API types
export interface MailgunSuccessResponse {
  id: string;
  message: string;
}

export interface MailgunErrorResponse {
  message: string;
  details?: string;
}

export type MailgunResponse = MailgunSuccessResponse | MailgunErrorResponse;

// Our custom email response type
export interface EmailResponse {
  success: boolean;
  data?: {
    id: string;
  };
  error?: string;
}

// Mailgun email options (basic structure - let TypeScript infer from actual usage)
export interface BasicMailgunOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Keep legacy EmailOptions for backward compatibility
export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}

// Resend types (deprecated but kept for migration period)
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