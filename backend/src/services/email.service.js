/**
 * Email Service
 * Handles sending emails for authentication and notifications
 */

import nodemailer from 'nodemailer';

// Email configuration from environment variables
const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '587',
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM = 'LogiSync <noreply@logisync.com>',
  FRONTEND_URL = 'http://localhost:5173'
} = process.env;

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: SMTP_PORT === '465', // true for 465, false for other ports
  auth: SMTP_USER && SMTP_PASS ? {
    user: SMTP_USER,
    pass: SMTP_PASS
  } : undefined,
  // For development without real SMTP
  ...(!SMTP_USER && {
    streamTransport: true,
    newline: 'unix',
    buffer: true
  })
});

/**
 * Send email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    });

    console.log('Email sent:', info.messageId);
    
    // Log email content in development if using streamTransport
    if (!SMTP_USER && info.message) {
      console.log('\n--- EMAIL CONTENT (Development) ---');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Message:', info.message.toString());
      console.log('--- END EMAIL ---\n');
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #171717;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f5f5f5;
          padding: 30px 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #171717;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        .code {
          font-family: monospace;
          background-color: #e5e5e5;
          padding: 2px 6px;
          border-radius: 3px;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to LogiSync!</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.first_name},</h2>
        <p>Thanks for signing up! Please verify your email address to get started.</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p class="code">${verificationUrl}</p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't create a LogiSync account, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>LogiSync - Inventory Management System</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Verify your LogiSync account',
    html
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #171717;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f5f5f5;
          padding: 30px 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #171717;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        .code {
          font-family: monospace;
          background-color: #e5e5e5;
          padding: 2px 6px;
          border-radius: 3px;
          word-break: break-all;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.first_name},</h2>
        <p>We received a request to reset your password for your LogiSync account.</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p class="code">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <div class="warning">
          <strong>⚠️ Security Notice:</strong>
          <p style="margin: 5px 0 0 0;">If you didn't request a password reset, please ignore this email. Your password will not be changed.</p>
        </div>
      </div>
      <div class="footer">
        <p>LogiSync - Inventory Management System</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Reset your LogiSync password',
    html
  });
};

/**
 * Send welcome email (after verification)
 */
export const sendWelcomeEmail = async (user) => {
  const dashboardUrl = `${FRONTEND_URL}/dashboard`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #22c55e;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f5f5f5;
          padding: 30px 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #171717;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        .feature {
          background-color: white;
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to LogiSync!</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.first_name},</h2>
        <p>Your email has been verified! You're all set to start using LogiSync.</p>
        
        <h3>What you can do with LogiSync:</h3>
        <div class="feature">
          <strong>📦 Inventory Management</strong>
          <p>Track your products, stock levels, and warehouse locations</p>
        </div>
        <div class="feature">
          <strong>📊 Orders & Shipments</strong>
          <p>Manage orders, track shipments, and fulfill customer requests</p>
        </div>
        <div class="feature">
          <strong>👥 Customer Management</strong>
          <p>Keep track of your customers and their order history</p>
        </div>
        <div class="feature">
          <strong>📈 Analytics & Reports</strong>
          <p>Get insights into your business with detailed analytics</p>
        </div>
        
        <p style="text-align: center;">
          <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
        </p>
        
        <p>Need help getting started? Check out our <a href="${FRONTEND_URL}/help">help center</a> or contact support.</p>
      </div>
      <div class="footer">
        <p>LogiSync - Inventory Management System</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: '🎉 Welcome to LogiSync!',
    html
  });
};

/**
 * Send password changed notification
 */
export const sendPasswordChangedEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #171717;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f5f5f5;
          padding: 30px 20px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: #666;
        }
        .warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Password Changed</h1>
      </div>
      <div class="content">
        <h2>Hi ${user.first_name},</h2>
        <p>This email confirms that your password was successfully changed.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <div class="warning">
          <strong>⚠️ Didn't change your password?</strong>
          <p style="margin: 5px 0 0 0;">If you didn't make this change, please contact support immediately at support@logisync.com</p>
        </div>
      </div>
      <div class="footer">
        <p>LogiSync - Inventory Management System</p>
        <p>This is an automated email, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Your LogiSync password was changed',
    html
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail
};
