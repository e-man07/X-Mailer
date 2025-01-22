import nodemailer from "nodemailer";
import { Transporter, TransportOptions } from 'nodemailer';

// Email styles for consistent look across all emails
export const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;',
  header: 'color: #2D3748; margin-bottom: 20px;',
  messageBox: 'background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;',
  message: 'white-space: pre-line; background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px; border: 1px solid #E2E8F0;',
  metadata: 'color: #4A5568; margin: 10px 0;',
  footer: 'color: #718096; font-size: 0.875rem; margin-top: 20px;',
  divider: 'border: 1px solid #E2E8F0; margin: 20px 0;'
};

// Create transporter for sending emails
export const transporter: Transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
} as TransportOptions);

export async function sendBlinkCreationEmail(to: string, blinkId: string, analyticsId: string, codename: string) {
  const currentDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your Blink "${codename}" has been created!`,
    html: `
      <div style="${emailStyles.container}">
        <h2 style="${emailStyles.header}">Your Blink has been created successfully!</h2>
        
        <div style="${emailStyles.messageBox}">
          <p style="${emailStyles.metadata}"><strong>Blink Name:</strong> ${codename}</p>
          <p style="${emailStyles.metadata}"><strong>Created on:</strong> ${currentDate}</p>
          
          <div style="${emailStyles.message}">
            <p><strong>Your Blink Details:</strong></p>
            <p>Blink ID: ${blinkId}</p>
            <p>Analytics ID: ${analyticsId}</p>
            <p>You can use your Analytics ID to track visits and messages to your Blink.</p>
          </div>
        </div>

        <hr style="${emailStyles.divider}">
        
        <p style="${emailStyles.footer}">
          Welcome to Email Blink!<br>
          Share your Blink ID with others to start receiving messages.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}