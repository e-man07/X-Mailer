import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { Transporter, TransportOptions } from 'nodemailer';

const CORS_HEADERS = {
  ...ACTIONS_CORS_HEADERS,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;',
  header: 'color: #2D3748; margin-bottom: 20px;',
  messageBox: 'background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E2E8F0;',
  message: 'white-space: pre-line; background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px; border: 1px solid #E2E8F0;',
  metadata: 'color: #4A5568; margin: 10px 0;',
  footer: 'color: #718096; font-size: 0.875rem; margin-top: 20px;',
  divider: 'border: 1px solid #E2E8F0; margin: 20px 0;'
};

const transporter: Transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
} as TransportOptions);

export async function POST(req: Request) {
  try {
    const { pathname, searchParams } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const uniqueBlinkId = pathSegments[4];

    const email = searchParams.get("email");
    const description = searchParams.get("description");
    const codename = searchParams.get("codename");

    if (!email || !description || !codename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    const blinkData = await prisma.blink.findUnique({
      where: { uniqueBlinkId },
    });

    if (!blinkData) {
      return NextResponse.json(
        { error: "Blink not found" },
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    const formattedMessage = `
      Dear ${blinkData.codename},

      I hope this message finds you well.

      ${description}

      Best regards,
      ${codename}
    `.trim();

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
      to: blinkData.email,
      subject: `New Message from ${codename} via Your Blink`,
      html: `
        <div style="${emailStyles.container}">
          <h2 style="${emailStyles.header}">You have received a new message through your Blink!</h2>
          
          <div style="${emailStyles.messageBox}">
            <p style="${emailStyles.metadata}"><strong>From:</strong> ${codename}</p>
            <p style="${emailStyles.metadata}"><strong>Email:</strong> ${email}</p>
            <p style="${emailStyles.metadata}"><strong>Sent on:</strong> ${currentDate}</p>
            
            <div style="${emailStyles.message}">
              ${formattedMessage.replace(/\n/g, '<br>')}
            </div>
          </div>

          <hr style="${emailStyles.divider}">
          
          <p style="${emailStyles.footer}">
            This message was sent through X-Mailer.<br>
            To respond, please contact the sender directly at ${email}
          </p>
        </div>
      `,
    };

    const senderMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Message Confirmation - Sent to ${blinkData.codename}`,
      html: `
        <div style="${emailStyles.container}">
          <h2 style="${emailStyles.header}">Your message has been sent successfully!</h2>
          
          <p>Thank you for using Blink to contact ${blinkData.codename}.</p>
          
          <div style="${emailStyles.messageBox}">
            <p style="${emailStyles.metadata}"><strong>Sent to:</strong> ${blinkData.codename}</p>
            <p style="${emailStyles.metadata}"><strong>Sent on:</strong> ${currentDate}</p>
            
            <p><strong>Your message:</strong></p>
            <div style="${emailStyles.message}">
              ${formattedMessage.replace(/\n/g, '<br>')}
            </div>
          </div>

          <hr style="${emailStyles.divider}">
          
          <p style="${emailStyles.footer}">
            This is an automated confirmation.<br>
            Please wait for ${blinkData.codename} to respond to your message.
          </p>
        </div>
      `,
    };

    const savedMail = await prisma.mail.create({
      data: {
        senderEmail: email,
        senderName: codename,
        messageBody: formattedMessage,
        creatorEmail: blinkData.email,
        blink: {
          connect: {
            id: blinkData.id
          }
        }
      },
    });

    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(senderMailOptions),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Mail data saved and notifications sent successfully",
        mailId: savedMail.id,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error("Error processing mail data:", error);
    return NextResponse.json(
      { 
        error: "Failed to process mail data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}