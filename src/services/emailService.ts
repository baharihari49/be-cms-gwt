// services/emailService.ts
import { 
  EmailData, 
  CustomerEmailData, 
  EmailResponse
} from '../types/email/email';
import { createAdminEmailTemplate, createCustomerEmailTemplate } from '../templates/emailTemplates';

import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

const verifiedEmailDomain = process.env.VERIFIED_EMAIL_DOMAIN as string;
const businessEmail = process.env.BUSINESS_EMAIL as string;
const mailgunDomain = process.env.MAILGUN_DOMAIN as string;

// Helper function to parse multiple emails
const parseBusinessEmails = (emailString: string): string[] => {
  return emailString.split(',').map(email => email.trim()).filter(email => email.length > 0);
};

/**
 * Helper function to handle Mailgun response and convert to our EmailResponse format
 */
const handleMailgunResponse = async (mailgunPromise: Promise<any>): Promise<EmailResponse> => {
  try {
    const result = await mailgunPromise;
    
    // Mailgun success response memiliki property 'id' dan 'message'
    if (result && typeof result === 'object' && 'id' in result) {
      return {
        success: true,
        data: {
          id: result.id
        }
      };
    } else {
      return {
        success: false,
        error: (result && typeof result === 'object' && 'message' in result) 
          ? result.message 
          : 'Unknown email service error'
      };
    }
  } catch (error: any) {
    console.error('Mailgun error:', error);
    
    // Handle specific Mailgun errors
    if (error && typeof error === 'object' && 'status' in error) {
      switch (error.status) {
        case 400:
          return {
            success: false,
            error: 'Bad request: Invalid email parameters'
          };
        case 401:
          return {
            success: false,
            error: 'Unauthorized: Invalid API key'
          };
        case 402:
          return {
            success: false,
            error: 'Payment required: Account needs payment'
          };
        case 404:
          return {
            success: false,
            error: 'Domain not found: Please verify your domain'
          };
        case 413:
          return {
            success: false,
            error: 'Message too large: Email content exceeds size limit'
          };
        default:
          return {
            success: false,
            error: `Mailgun error: ${error.message || 'Unknown error'}`
          };
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const sendAdminEmail = async (data: EmailData): Promise<EmailResponse> => {
  const { name, email, phone, company, service, budget, timeline, message } = data;
  
  // Parse multiple business emails
  const businessEmails = parseBusinessEmails(businessEmail);
  
  // Use simple object instead of MailgunOptions interface
  const emailOptions = {
    from: verifiedEmailDomain,
    to: businessEmails, // Array of emails
    subject: `New Contact Form Submission - ${service || 'General Inquiry'}`,
    html: createAdminEmailTemplate({
      name, email, phone, company, service, budget, timeline, message
    })
  };

  console.log('Sending admin email via Mailgun to:', businessEmails);
  
  try {
    const mailgunPromise = mg.messages.create(mailgunDomain, emailOptions);
    return await handleMailgunResponse(mailgunPromise);
  } catch (error) {
    console.error('Error sending admin email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send admin email';
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const sendCustomerEmail = async (data: CustomerEmailData): Promise<EmailResponse> => {
  const { name, email, service, timeline, budget } = data;
  
  // Use simple object instead of MailgunOptions interface
  const emailOptions = {
    from: verifiedEmailDomain,
    to: email,
    subject: 'Thank you for contacting GWT Technology!',
    html: createCustomerEmailTemplate({
      name, email, service, timeline, budget
    })
  };

  console.log('Sending customer email via Mailgun...');
  
  try {
    const mailgunPromise = mg.messages.create(mailgunDomain, emailOptions);
    return await handleMailgunResponse(mailgunPromise);
  } catch (error) {
    console.error('Error sending customer email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send customer email';
    return {
      success: false,
      error: errorMessage
    };
  }
};