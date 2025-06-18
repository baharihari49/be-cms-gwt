// utils/validation.ts
import { ValidationResult } from '../types/email/email'

interface RequiredFields {
  name: string;
  email: string;
  message: string;
}

export const validateContactForm = ({ name, email, message }: RequiredFields): ValidationResult => {
  // Check required fields
  if (!name || !email || !message) {
    return {
      isValid: false,
      error: 'Name, email, and message are required fields'
    };
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please provide a valid email address'
    };
  }

  return {
    isValid: true,
    error: null
  };
};