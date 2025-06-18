// templates/emailTemplates.ts
import { EmailData, CustomerEmailData } from '../types/email/email';

export const createAdminEmailTemplate = (data: EmailData): string => {
  const { name, email, phone, company, service, budget, timeline, message } = data;
  
  const getBudgetPriority = (budget?: string): { class: string; label: string } => {
    if (!budget) return { class: 'low', label: '📝 STANDARD' };
    
    const budgetNumber = parseInt(budget.replace(/[^0-9]/g, ''));
    if (budgetNumber > 50000) return { class: 'high', label: '🔥 HIGH VALUE' };
    return { class: 'medium', label: '⚡ MEDIUM' };
  };

  const priority = getBudgetPriority(budget);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #3b82f6; }
        .message-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .priority.high { background: #fef2f2; color: #dc2626; }
        .priority.medium { background: #fffbeb; color: #d97706; }
        .priority.low { background: #f0fdf4; color: #16a34a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">GWT Technology Contact Form</p>
        </div>
        
        <div class="content">
          <div style="margin-bottom: 20px;">
            <span class="priority ${priority.class}">
              ${priority.label}
            </span>
          </div>

          <div class="field">
            <div class="label">👤 Full Name:</div>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <div class="label">📧 Email Address:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>

          ${phone ? `
            <div class="field">
              <div class="label">📞 Phone Number:</div>
              <div class="value"><a href="tel:${phone}">${phone}</a></div>
            </div>
          ` : ''}

          ${company ? `
            <div class="field">
              <div class="label">🏢 Company:</div>
              <div class="value">${company}</div>
            </div>
          ` : ''}

          ${service ? `
            <div class="field">
              <div class="label">🔧 Service Needed:</div>
              <div class="value">${service}</div>
            </div>
          ` : ''}

          ${budget ? `
            <div class="field">
              <div class="label">💰 Budget Range:</div>
              <div class="value">${budget}</div>
            </div>
          ` : ''}

          ${timeline ? `
            <div class="field">
              <div class="label">📅 Timeline:</div>
              <div class="value">${timeline}</div>
            </div>
          ` : ''}

          <div class="message-box">
            <div class="label">💬 Message:</div>
            <div style="margin-top: 10px; white-space: pre-line;">${message}</div>
          </div>

          <div class="footer">
            <p>Submitted on ${new Date().toLocaleString('en-US', { 
              timeZone: 'America/Los_Angeles',
              dateStyle: 'full',
              timeStyle: 'long'
            })}</p>
            <p>This email was sent from the GWT contact form on your website.</p>
          </div>
        </div>
      </div>
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
      <title>Thank You - GWT Technology</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .highlight { background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .social-links { text-align: center; margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; padding: 10px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GWT</div>
          <h1 style="margin: 0;">Thank You, ${name}!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message and will get back to you soon.</p>
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
            <p>Call us at: <strong>+1 (555) 123-4567</strong></p>
            <p>Email us at: <strong>contact@gwt.com</strong></p>
            <p>Business hours: Mon-Fri 9:00 AM - 6:00 PM PST</p>
          </div>

          <div class="social-links">
            <a href="https://linkedin.com/company/gwt-technology">LinkedIn</a>
            <a href="https://github.com/gwt-company">GitHub</a>
            <a href="https://gwt.com/portfolio">Portfolio</a>
          </div>

          <p style="text-align: center; color: #6b7280; margin-top: 30px;">
            Thank you for choosing GWT Technology for your project needs!<br>
            <small>This is an automated response. Please do not reply to this email.</small>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};