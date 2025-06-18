// services/emailService.ts
import { Resend } from 'resend';
import { 
  EmailData, 
  CustomerEmailData, 
  EmailResponse, 
  EmailOptions,
  ResendResponse 
} from '../types/email/email';
import { createAdminEmailTemplate, createCustomerEmailTemplate } from '../templates/emailTemplates';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);
const verifiedEmailDomain = process.env.VERIFIED_EMAIL_DOMAIN as string
const businessEmail = process.env.BUSINESS_EMAIL as string

/**
 * Helper function to handle Resend response and convert to our EmailResponse format
 */
const handleResendResponse = async (resendPromise: Promise<ResendResponse>): Promise<EmailResponse> => {
  try {
    const result = await resendPromise;
    
    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'Unknown email service error'
      };
    }
    
    return {
      success: true,
      data: {
        id: result.data.id
      }
    };
  } catch (error) {
    // Handle any unexpected errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const sendAdminEmail = async (data: EmailData): Promise<EmailResponse> => {
  const { name, email, phone, company, service, budget, timeline, message } = data;
  
  const emailOptions: EmailOptions = {
    from: verifiedEmailDomain, // Replace with your verified domain
    to: [businessEmail], // Your business emails
    subject: `New Contact Form Submission - ${service || 'General Inquiry'}`,
    html: createAdminEmailTemplate({
      name, email, phone, company, service, budget, timeline, message
    })
  };

  
  try {
    const resendPromise = resend.emails.send(emailOptions) as Promise<ResendResponse>;
    return await handleResendResponse(resendPromise);
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
  
  const emailOptions: EmailOptions = {
    from: verifiedEmailDomain, // Replace with your verified domain
    to: email,
    subject: 'Thank you for contacting GWT Technology!',
    html: createCustomerEmailTemplate({
      name, email, service, timeline, budget
    })
  };

  console.log('Sending customer email...');
  
  try {
    const resendPromise = resend.emails.send(emailOptions) as Promise<ResendResponse>;
    return await handleResendResponse(resendPromise);
  } catch (error) {
    console.error('Error sending customer email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send customer email';
    return {
      success: false,
      error: errorMessage
    };
  }
};