// controllers/contactController.ts
import { Request, Response } from 'express';
import { ContactFormData, ApiResponse, ContactApiResponse } from '../../types/email/email';
import { EmailResponse } from '../../types/email/email';
import { validateContactForm } from '../../utils/validation';
import { sendAdminEmail, sendCustomerEmail } from '../../services/emailService';

export const sendContactEmail = async (
  req: Request<{}, ContactApiResponse | ApiResponse, ContactFormData>,
  res: Response<ContactApiResponse | ApiResponse>
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      budget,
      timeline,
      message
    } = req.body;

    // Validation
    const validationResult = validateContactForm({ name, email, message });
    if (!validationResult.isValid) {
      res.status(400).json({
        success: false,
        error: validationResult.error || 'Validation failed'
      });
      return;
    }

    
    // Send email to admin
    const adminEmailResult: EmailResponse = await sendAdminEmail({
      name, email, phone, company, service, budget, timeline, message
    });
    
    if (!adminEmailResult.success) {
      console.error('Failed to send admin email:', adminEmailResult.error);
      res.status(500).json({
        success: false,
        error: `Failed to send admin notification: ${adminEmailResult.error}`
      });
      return;
    }
    

    // Send auto-reply to customer
    const customerEmailResult: EmailResponse = await sendCustomerEmail({
      name, email, service, timeline, budget
    });
    
    if (!customerEmailResult.success) {
      console.error('Failed to send customer email:', customerEmailResult.error);
      // Continue even if customer email fails, admin email was successful
      console.warn('Customer email failed but admin email was sent successfully');
    }
    

    // Success response
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
      data: {
        adminEmailId: adminEmailResult.data?.id,
        customerEmailId: customerEmailResult.success ? customerEmailResult.data?.id : undefined,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};