// templates/emailTemplates.ts
import { EmailData, CustomerEmailData } from '../types/email/email';

export const createAdminEmailTemplate = (data: EmailData): string => {
  const { name, email, phone, company, service, budget, timeline, message } = data;
  
  const getBudgetPriority = (budget?: string): { class: string; label: string } => {
    if (!budget) return { class: 'low', label: '📝 STANDARD' };
    
    // Handle Indonesian Rupiah format
    const budgetNumber = parseInt(budget.replace(/[^0-9]/g, ''));
    if (budgetNumber > 750000000) return { class: 'high', label: '🔥 HIGH VALUE' }; // > 750M IDR
    if (budgetNumber > 75000000) return { class: 'medium', label: '⚡ MEDIUM' }; // > 75M IDR
    return { class: 'low', label: '📝 STANDARD' };
  };

  const priority = getBudgetPriority(budget);

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Contact Form Submission</title>
      <style type="text/css">
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        
        /* Base styles */
        body {
          margin: 0 !important;
          padding: 0 !important;
          background-color: #f5f5f5 !important;
          font-family: Arial, sans-serif !important;
          font-size: 14px;
          line-height: 1.8; /* Increased line height */
          color: #333333;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        
        .header {
          background: #3b82f6;
          padding: 40px 25px; /* Increased padding */
          text-align: center;
        }
        
        .header h1 {
          margin: 0 0 15px 0; /* Increased margin */
          color: #ffffff;
          font-size: 24px;
          font-weight: bold;
          line-height: 1.4; /* Better line height */
        }
        
        .header p {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
          opacity: 0.9;
          line-height: 1.5;
        }
        
        .content {
          padding: 35px 25px; /* Increased padding */
        }
        
        .priority {
          display: inline-block;
          padding: 12px 20px; /* Increased padding */
          border-radius: 25px; /* More rounded */
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 30px; /* Increased margin */
        }
        
        .priority.high {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        
        .priority.medium {
          background-color: #fffbeb;
          color: #d97706;
          border: 1px solid #fed7aa;
        }
        
        .priority.low {
          background-color: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }
        
        .field {
          margin-bottom: 25px; /* Increased margin */
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 20px; /* Increased padding */
        }
        
        .label {
          font-weight: bold;
          color: #374151;
          font-size: 14px;
          margin-bottom: 12px; /* Increased margin */
          line-height: 1.5;
        }
        
        .value {
          padding: 16px 20px; /* Increased padding */
          background-color: #f8fafc;
          border-left: 4px solid #3b82f6;
          font-size: 15px;
          line-height: 1.6; /* Better line height */
          border-radius: 6px; /* Added border radius */
        }
        
        .value a {
          color: #3b82f6;
          text-decoration: none;
          padding: 8px 0; /* Better touch target */
          display: inline-block;
        }
        
        .message-box {
          background-color: #f8fafc;
          padding: 25px; /* Increased padding */
          border: 1px solid #e5e7eb;
          margin-top: 15px; /* Increased margin */
          border-radius: 8px; /* Added border radius */
        }
        
        .message-content {
          white-space: pre-line;
          font-size: 15px;
          line-height: 1.8; /* Increased line height */
        }
        
        .footer {
          text-align: center;
          margin-top: 50px; /* Increased margin */
          padding-top: 25px; /* Increased padding */
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.6;
        }
        
        /* Enhanced Mobile responsive - iPhone specific */
        @media only screen and (max-width: 600px) {
          .email-container {
            width: 100% !important;
            margin: 0 !important;
          }
          
          .content {
            padding: 30px 20px !important; /* More generous mobile padding */
          }
          
          .header {
            padding: 35px 20px !important; /* Better header padding */
          }
          
          .header h1 {
            font-size: 22px !important;
            margin-bottom: 12px !important;
          }
          
          .priority {
            padding: 10px 16px !important;
            margin-bottom: 25px !important;
            font-size: 11px !important;
          }
          
          .field {
            margin-bottom: 30px !important; /* More space between fields */
            padding-bottom: 20px !important;
          }
          
          .label {
            margin-bottom: 10px !important;
            font-size: 13px !important;
          }
          
          .value {
            padding: 18px !important; /* Increased mobile padding */
            margin-top: 8px !important;
            border-radius: 8px !important;
          }
          
          .value a {
            padding: 10px 0 !important; /* Better touch targets */
            min-height: 44px !important; /* iOS recommended touch target */
            display: block !important;
          }
          
          .message-box {
            padding: 20px !important;
            margin-top: 12px !important;
          }
          
          .footer {
            margin-top: 40px !important;
            padding-top: 20px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
        
        /* iPhone specific optimizations */
        @media only screen and (max-width: 480px) {
          .content {
            padding: 25px 15px !important; /* iPhone specific padding */
          }
          
          .header {
            padding: 30px 15px !important;
          }
          
          .field {
            margin-bottom: 25px !important;
          }
          
          .value {
            padding: 15px !important;
          }
          
          .message-box {
            padding: 18px !important;
          }
        }
      </style>
    </head>
    <body>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="background-color: #f5f5f5; padding: 20px 0;">
            <table class="email-container" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff;">
              <!-- Header -->
              <tr>
                <td class="header" style="background-color: #3b82f6; padding: 40px 25px; text-align: center;">
                  <h1 style="margin: 0 0 15px 0; color: #ffffff; font-size: 24px; font-weight: bold; line-height: 1.4;">📧 New Contact Form Submission</h1>
                  <p style="margin: 0; color: #ffffff; font-size: 16px; line-height: 1.5;">GWT Technology Contact Form</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td class="content" style="padding: 35px 25px;">
                  
                  <div class="priority ${priority.class}" style="display: inline-block; padding: 12px 20px; border-radius: 25px; font-size: 12px; font-weight: bold; margin-bottom: 30px; ${priority.class === 'high' ? 'background-color: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' : priority.class === 'medium' ? 'background-color: #fffbeb; color: #d97706; border: 1px solid #fed7aa;' : 'background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;'}">
                    ${priority.label}
                  </div>
                  
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">👤 Full Name</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;">${name}</div>
                  </div>
                  
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">📧 Email Address</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; padding: 8px 0; display: inline-block;">${email}</a></div>
                  </div>
                  
                  ${phone ? `
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">📞 Phone Number</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;"><a href="tel:${phone}" style="color: #3b82f6; text-decoration: none; padding: 8px 0; display: inline-block;">${phone}</a></div>
                  </div>
                  ` : ''}
                  
                  ${company ? `
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">🏢 Company</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;">${company}</div>
                  </div>
                  ` : ''}
                  
                  ${service ? `
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">🔧 Service Needed</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;">${service}</div>
                  </div>
                  ` : ''}
                  
                  ${budget ? `
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">💰 Budget Range</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;">${budget}</div>
                  </div>
                  ` : ''}
                  
                  ${timeline ? `
                  <div class="field" style="margin-bottom: 25px; border-bottom: 1px solid #f0f0f0; padding-bottom: 20px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">📅 Timeline</div>
                    <div class="value" style="padding: 16px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; font-size: 15px; line-height: 1.6; border-radius: 6px;">${timeline}</div>
                  </div>
                  ` : ''}
                  
                  <div class="field" style="margin-bottom: 25px;">
                    <div class="label" style="font-weight: bold; color: #374151; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">💬 Message</div>
                    <div class="message-box" style="background-color: #f8fafc; padding: 25px; border: 1px solid #e5e7eb; margin-top: 15px; border-radius: 8px;">
                      <div class="message-content" style="white-space: pre-line; font-size: 15px; line-height: 1.8;">${message}</div>
                    </div>
                  </div>
                  
                  <div class="footer" style="text-align: center; margin-top: 50px; padding-top: 25px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; line-height: 1.6;">
                    <p><strong>Submitted on:</strong> ${new Date().toLocaleString('id-ID', { 
                      timeZone: 'Asia/Jakarta',
                      dateStyle: 'full',
                      timeStyle: 'long'
                    })}</p>
                    <p>This email was sent from the GWT Technology contact form.</p>
                  </div>
                  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export const createCustomerEmailTemplate = (data: CustomerEmailData): string => {
  const { name, service, timeline, budget } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - GWT Technology</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.8; /* Increased line height */
          color: #333; 
          margin: 0; 
          padding: 0;
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #3b82f6, #06b6d4); 
          color: white; 
          padding: 45px 35px; /* Increased padding */
          text-align: center; 
        }
        .content { 
          padding: 35px 30px; /* Increased padding */
        }
        .logo { 
          font-size: 36px; 
          font-weight: bold; 
          margin-bottom: 20px; /* Increased margin */
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .highlight { 
          background: linear-gradient(135deg, #3b82f6, #06b6d4); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
          font-weight: 700;
          font-size: 24px;
          margin-bottom: 25px; /* Increased margin */
          line-height: 1.4;
        }
        .info-box { 
          background: #f8fafc; 
          padding: 28px; /* Increased padding */
          border-radius: 12px; 
          margin: 25px 0; /* Increased margin */
          border-left: 4px solid #3b82f6; 
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .info-box h3 {
          margin-top: 0;
          margin-bottom: 18px; /* Increased margin */
          color: #374151;
          font-size: 18px;
          line-height: 1.4;
        }
        .info-box p {
          margin: 12px 0; /* Increased margin */
          font-size: 15px;
          line-height: 1.6;
        }
        .info-box ul {
          margin: 15px 0; /* Increased margin */
          padding-left: 20px;
        }
        .info-box li {
          margin: 12px 0; /* Increased margin */
          font-size: 15px;
          line-height: 1.6;
        }
        .social-links { 
          text-align: center; 
          margin: 35px 0; /* Increased margin */
        }
        .social-links table {
          margin: 0 auto;
        }
        .social-links a { 
          display: block;
          padding: 14px 22px; /* Increased padding for better touch targets */
          background: #3b82f6; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          transition: background-color 0.3s ease;
          text-align: center;
          font-size: 14px;
          line-height: 1.2;
        }
        .social-links a:hover {
          background: #2563eb;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.3;
        }
        .header p {
          margin: 18px 0 0 0; /* Increased margin */
          opacity: 0.9;
          font-size: 16px;
          line-height: 1.5;
        }
        .footer-text {
          text-align: center; 
          color: #6b7280; 
          margin-top: 45px; /* Increased margin */
          padding-top: 25px; /* Increased padding */
          border-top: 1px solid #e5e7eb;
          line-height: 1.6;
        }
        .footer-text small {
          font-size: 12px;
          line-height: 1.5;
        }
        
        /* Enhanced Mobile responsive - iPhone specific */
        @media only screen and (max-width: 600px) {
          .container {
            margin: 10px !important;
            border-radius: 8px !important;
          }
          
          .header {
            padding: 35px 25px !important; /* Better mobile padding */
          }
          
          .header h1 {
            font-size: 28px !important;
            margin-bottom: 12px !important;
          }
          
          .header p {
            margin-top: 15px !important;
          }
          
          .content {
            padding: 30px 20px !important; /* More generous mobile padding */
          }
          
          .logo {
            font-size: 32px !important;
            margin-bottom: 15px !important;
          }
          
          .highlight {
            font-size: 22px !important;
            margin-bottom: 20px !important;
          }
          
          .info-box {
            padding: 20px !important; /* Better mobile padding */
            margin: 20px 0 !important;
          }
          
          .info-box h3 {
            margin-bottom: 15px !important;
            font-size: 16px !important;
          }
          
          .info-box p {
            margin: 10px 0 !important;
            font-size: 14px !important;
          }
          
          .info-box li {
            margin: 10px 0 !important;
            font-size: 14px !important;
          }
          
          .social-links {
            margin: 30px 0 !important;
            text-align: center !important;
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 8px !important;
          }
          
          .social-links a {
            margin: 6px 8px !important; /* Better mobile spacing */
            padding: 12px 18px !important;
            font-size: 14px !important;
            display: inline-block !important; /* Keep side by side */
            width: auto !important; /* Don't force full width */
          }
          
          .footer-text {
            margin-top: 35px !important;
            padding-top: 20px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
        
        /* iPhone specific optimizations */
        @media only screen and (max-width: 480px) {
          .container {
            margin: 5px !important;
          }
          
          .header {
            padding: 30px 20px !important;
          }
          
          .content {
            padding: 25px 15px !important;
          }
          
          .info-box {
            padding: 18px !important;
            margin: 18px 0 !important;
          }
          
          .social-links {
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
          
          .social-links td {
            padding: 3px !important;
          }
          
          .social-links a {
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 GWT</div>
          <h1>Thank You, ${name}!</h1>
          <p>We've received your message and will get back to you soon.</p>
        </div>
        
        <div class="content">
          <h2 class="highlight">What happens next?</h2>
          
          <div class="info-box">
            <h3>📋 Your submission details:</h3>
            <p><strong>Service:</strong> ${service || 'General Inquiry'}</p>
            <p><strong>Timeline:</strong> ${timeline || 'To be discussed'}</p>
            <p><strong>Budget:</strong> ${budget || 'To be discussed'}</p>
          </div>

          <div class="info-box">
            <h3>⏰ Our response timeline:</h3>
            <ul>
              <li><strong>Initial response:</strong> Within 24 hours</li>
              <li><strong>Detailed consultation:</strong> 2-3 business days</li>
              <li><strong>Project proposal:</strong> Within 1 week</li>
            </ul>
          </div>

          <div class="info-box">
            <h3>📞 Need immediate assistance?</h3>
            <p><strong>Phone:</strong> <a href="tel:+6281234567890" style="color: #3b82f6; text-decoration: none;">+62 812-3456-7890</a></p>
            <p><strong>Email:</strong> <a href="mailto:contact@gwt.co.id" style="color: #3b82f6; text-decoration: none;">contact@gwt.co.id</a></p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/6281234567890" style="color: #3b82f6; text-decoration: none;">+62 812-3456-7890</a></p>
            <p><strong>Business hours:</strong> Mon-Fri 9:00 AM - 6:00 PM WIB</p>
          </div>

          <div class="social-links">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
              <tr>
                <td style="padding: 8px;">
                  <a href="https://gwt.co.id/portfolio" style="display: block; padding: 12px 18px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 14px;">View Portfolio</a>
                </td>
                <td style="padding: 8px;">
                  <a href="https://gwt.co.id/services" style="display: block; padding: 12px 18px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 14px;">Our Services</a>
                </td>
              </tr>
            </table>
          </div>

          <div class="footer-text">
            <p><strong>Thank you for choosing GWT Technology for your project needs!</strong></p>
            <small>This is an automated response. Please do not reply to this email directly.<br>
            For any questions, please contact us at <a href="mailto:contact@gwt.co.id" style="color: #3b82f6;">contact@gwt.co.id</a></small>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};