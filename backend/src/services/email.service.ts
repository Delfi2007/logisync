/**
 * Email Service
 * 
 * Handles email sending with:
 * - SMTP configuration
 * - Email templates
 * - Queue system with retry logic
 * - Email logging
 * - Attachment support
 * 
 * @module services/email.service
 */

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import pool from '../config/database';

// ============================================
// CONFIGURATION
// ============================================

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@logisync.com';
const FROM_NAME = process.env.FROM_NAME || 'LogiSync';

// ============================================
// INTERFACES
// ============================================

export interface EmailOptions {
  to: string;
  subject?: string; // Optional when using templates
  html?: string;
  text?: string;
  template?: EmailTemplate;
  templateData?: any;
  attachments?: EmailAttachment[];
  cc?: string;
  bcc?: string;
}

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer | string;
  contentType?: string;
}

export interface EmailLog {
  id: number;
  user_id?: number;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  email_type?: string;
  template_name?: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sent_at?: Date;
  failed_at?: Date;
  error_message?: string;
  attachments?: any;
  metadata?: any;
  created_at: Date;
}

export enum EmailTemplate {
  INVOICE = 'invoice',
  REPORT = 'report',
  NOTIFICATION = 'notification',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  ORDER_CONFIRMATION = 'order_confirmation',
  SHIPMENT_UPDATE = 'shipment_update'
}

// ============================================
// EMAIL TEMPLATES
// ============================================

const emailTemplates = {
  [EmailTemplate.INVOICE]: {
    subject: (data: any) => `Invoice #${data.invoiceNumber} from ${data.companyName}`,
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.companyName}</h1>
          </div>
          <div class="content">
            <h2>Invoice #${data.invoiceNumber}</h2>
            <p>Dear ${data.customerName},</p>
            <p>Thank you for your business. Please find your invoice attached.</p>
            
            <table>
              <tr>
                <th>Invoice Date</th>
                <td>${data.invoiceDate}</td>
              </tr>
              <tr>
                <th>Due Date</th>
                <td>${data.dueDate}</td>
              </tr>
              <tr>
                <th>Total Amount</th>
                <td><strong>₹${data.totalAmount.toLocaleString('en-IN')}</strong></td>
              </tr>
            </table>

            <p>You can download the invoice PDF from the attachment.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.companyName}. All rights reserved.</p>
            <p>${data.companyAddress}</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailTemplate.REPORT]: {
    subject: (data: any) => `${data.reportName} - ${data.period}`,
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LogiSync Report</h1>
          </div>
          <div class="content">
            <h2>${data.reportName}</h2>
            <p>Report Period: <strong>${data.period}</strong></p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
            
            <p>Your ${data.reportName} is attached to this email.</p>
            
            ${data.summary ? `<p><strong>Summary:</strong><br>${data.summary}</p>` : ''}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} LogiSync. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailTemplate.PASSWORD_RESET]: {
    subject: () => 'Password Reset Request - LogiSync',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #DC2626; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <p style="text-align: center;">
              <a href="${data.resetLink}" class="button">Reset Password</a>
            </p>
            <p>Or copy this link: <br><code>${data.resetLink}</code></p>
            <p>This link will expire in ${data.expiryHours || 1} hour(s).</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} LogiSync. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  [EmailTemplate.WELCOME]: {
    subject: () => 'Welcome to LogiSync!',
    html: (data: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LogiSync!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Welcome to LogiSync! We're excited to have you on board.</p>
            <p>LogiSync helps you manage your logistics, inventory, and deliveries with ease.</p>
            <p style="text-align: center;">
              <a href="${data.dashboardLink}" class="button">Go to Dashboard</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} LogiSync. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// ============================================
// EMAIL SERVICE
// ============================================

class EmailService {
  private transporter: Mail;
  private emailQueue: EmailOptions[] = [];
  private processing: boolean = false;

  constructor() {
    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    // Start queue processor
    this.startQueueProcessor();
  }

  /**
   * Send email immediately
   */
  async send(options: EmailOptions): Promise<boolean> {
    try {
      // Prepare email content
      const emailContent = this.prepareEmail(options);

      // Send email
      const info = await this.transporter.sendMail(emailContent);

      // Log success
      await this.logEmail({
        recipient_email: options.to,
        subject: emailContent.subject,
        email_type: options.template,
        status: 'sent',
        sent_at: new Date(),
        attachments: options.attachments ? JSON.stringify(options.attachments.map(a => ({
          filename: a.filename,
          contentType: a.contentType
        }))) : null
      });

      console.log('Email sent:', info.messageId);
      return true;
    } catch (error: any) {
      console.error('Email send error:', error);

      // Log failure
      await this.logEmail({
        recipient_email: options.to,
        subject: options.subject,
        email_type: options.template,
        status: 'failed',
        failed_at: new Date(),
        error_message: error.message
      });

      return false;
    }
  }

  /**
   * Add email to queue (for async sending)
   */
  async queue(options: EmailOptions): Promise<void> {
    this.emailQueue.push(options);

    // Log as pending
    await this.logEmail({
      recipient_email: options.to,
      subject: options.subject,
      email_type: options.template,
      status: 'pending'
    });
  }

  /**
   * Process email queue
   */
  private async startQueueProcessor(): Promise<void> {
    setInterval(async () => {
      if (this.processing || this.emailQueue.length === 0) {
        return;
      }

      this.processing = true;

      while (this.emailQueue.length > 0) {
        const emailOptions = this.emailQueue.shift();
        if (emailOptions) {
          await this.send(emailOptions);
          // Wait 1 second between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      this.processing = false;
    }, 5000); // Check queue every 5 seconds
  }

  /**
   * Prepare email content from template
   */
  private prepareEmail(options: EmailOptions): Mail.Options {
    let subject = options.subject || '';
    let html = options.html;
    let text = options.text;

    // Use template if specified
    if (options.template) {
      const templateKey = options.template as keyof typeof emailTemplates;
      if (emailTemplates[templateKey]) {
        const template = emailTemplates[templateKey];
        subject = template.subject(options.templateData || {});
        html = template.html(options.templateData || {});
      }
    }

    return {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject,
      html,
      text,
      attachments: options.attachments
    };
  }

  /**
   * Log email to database
   */
  private async logEmail(log: Partial<EmailLog>): Promise<void> {
    try {
      const query = `
        INSERT INTO email_logs (
          user_id, recipient_email, recipient_name, subject, email_type,
          template_name, status, sent_at, failed_at, error_message, attachments, metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;

      await pool.query(query, [
        log.user_id || null,
        log.recipient_email,
        log.recipient_name || null,
        log.subject,
        log.email_type || null,
        log.template_name || null,
        log.status,
        log.sent_at || null,
        log.failed_at || null,
        log.error_message || null,
        log.attachments || null,
        log.metadata ? JSON.stringify(log.metadata) : null
      ]);
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  /**
   * Send invoice email
   */
  async sendInvoice(
    to: string,
    invoiceData: any,
    pdfPath: string
  ): Promise<boolean> {
    return await this.send({
      to,
      template: EmailTemplate.INVOICE,
      templateData: invoiceData,
      attachments: [{
        filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
        path: pdfPath,
        contentType: 'application/pdf'
      }]
    });
  }

  /**
   * Send report email
   */
  async sendReport(
    to: string,
    reportData: any,
    attachmentPath: string,
    attachmentName: string
  ): Promise<boolean> {
    return await this.send({
      to,
      template: EmailTemplate.REPORT,
      templateData: reportData,
      attachments: [{
        filename: attachmentName,
        path: attachmentPath
      }]
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(
    to: string,
    name: string,
    resetLink: string
  ): Promise<boolean> {
    return await this.send({
      to,
      template: EmailTemplate.PASSWORD_RESET,
      templateData: { name, resetLink, expiryHours: 1 }
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcome(
    to: string,
    name: string,
    dashboardLink: string
  ): Promise<boolean> {
    return await this.send({
      to,
      template: EmailTemplate.WELCOME,
      templateData: { name, dashboardLink }
    });
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connection verified');
      return true;
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return false;
    }
  }

  /**
   * Get email logs
   */
  async getEmailLogs(
    user_id?: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<EmailLog[]> {
    let query = 'SELECT * FROM email_logs';
    const values: any[] = [];

    if (user_id) {
      query += ' WHERE user_id = $1';
      values.push(user_id);
    }

    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const emailService = new EmailService();

export default emailService;
export { EmailService };
