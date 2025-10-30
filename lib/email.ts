import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      ...options,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export function getPaymentConfirmationEmail(
  studentName: string,
  className: string,
  classDate: string,
  classTime: string,
  meetingLink: string,
  price: number
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3f8ce4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #3f8ce4; border-radius: 4px; }
        .button { display: inline-block; background: #3f8ce4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Enrollment Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi ${studentName},</p>
          
          <p>Thank you for enrolling in <strong>${className}</strong>!</p>
          
          <div class="info-box">
            <h3>Class Details:</h3>
            <p><strong>Class:</strong> ${className}</p>
            <p><strong>Date:</strong> ${classDate}</p>
            <p><strong>Time:</strong> ${classTime}</p>
            <p><strong>Price Paid:</strong> $${price.toFixed(2)}</p>
          </div>
          
          <div class="info-box">
            <h3>Join Your Class:</h3>
            <p>Click the button below to join the class meeting:</p>
            <a href="${meetingLink}" class="button">Join Class on Teams</a>
            <p style="font-size: 12px; color: #666;">Or copy this link: ${meetingLink}</p>
          </div>
          
          <p>We're excited to have you join us! Please make sure to:</p>
          <ul>
            <li>Test your microphone and camera before the class</li>
            <li>Join a few minutes early</li>
            <li>Have Cursor installed and ready</li>
          </ul>
          
          <p>If you have any questions, please don't hesitate to reach out!</p>
          
          <p>Best regards,<br>AI/Cursor Academy Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getReminderEmail(
  studentName: string,
  className: string,
  classDate: string,
  classTime: string,
  meetingLink: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3f8ce4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #3f8ce4; border-radius: 4px; }
        .button { display: inline-block; background: #3f8ce4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Class Reminder</h1>
        </div>
        <div class="content">
          <p>Hi ${studentName},</p>
          
          <p>This is a friendly reminder that your class <strong>${className}</strong> is coming up!</p>
          
          <div class="info-box">
            <h3>Class Details:</h3>
            <p><strong>Class:</strong> ${className}</p>
            <p><strong>Date:</strong> ${classDate}</p>
            <p><strong>Time:</strong> ${classTime}</p>
          </div>
          
          <a href="${meetingLink}" class="button">Join Class on Teams</a>
          
          <p>See you there!</p>
          
          <p>Best regards,<br>AI/Cursor Academy Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

