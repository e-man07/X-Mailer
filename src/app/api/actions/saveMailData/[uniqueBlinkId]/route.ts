import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { Transporter, TransportOptions } from 'nodemailer';
import { Blink, Analytics } from '@prisma/client'

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

type BlinkWithAnalytics = Blink & {
  analytics: Analytics | null
}

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
      include: {
        analytics: true
      }
    }) as BlinkWithAnalytics | null;

    if (!blinkData) {
      return NextResponse.json(
        { error: "Blink not found" },
        {
          status: 404,
          headers: CORS_HEADERS,
        }
      );
    }

    // Create or update analytics
    if (!blinkData.analytics) {
      // Create new analytics if it doesn't exist
      await prisma.analytics.create({
        data: {
          blink: { connect: { id: blinkData.id } },
          totalMails: 1,
          totalVisits: 0,
          lastVisited: new Date(),
          earnings: blinkData.askingFee,
          mailTimestamps: [new Date()]
        }
      });
    } else {
      // Update existing analytics
      const currentTimestamps = blinkData.analytics.mailTimestamps || [];
      await prisma.analytics.update({
        where: { id: blinkData.analytics.id },
        data: {
          totalMails: { increment: 1 },
          earnings: { increment: blinkData.askingFee },
          mailTimestamps: [...currentTimestamps, new Date()],
          updatedAt: new Date()
        }
      });
    }

    // Create the mail record
    const mail = await prisma.mail.create({
      data: {
        senderEmail: email,
        senderName: codename,
        messageBody: description,
        creatorEmail: blinkData.email,
        blink: { connect: { id: blinkData.id } }
      }
    });

    // Send email notifications
    const formattedMessage = `
      Dear ${blinkData.codename},

      I hope this message finds you well.

      ${description}

      Best regards,
      ${codename}
      ${email}
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: blinkData.email,
      subject: `New Message from ${codename}`,
      html: `
        <div style="${emailStyles.container}">
          <div style="${emailStyles.header}">
            <h2>You've received a new message!</h2>
          </div>
          
          <div style="${emailStyles.messageBox}">
            <div style="${emailStyles.metadata}">
              <strong>From:</strong> ${codename} (${email})
            </div>
            
            <div style="${emailStyles.message}">
              ${formattedMessage}
            </div>
          </div>
          
          <div style="${emailStyles.footer}">
            <p>This message was sent via X-Mailer</p>
          </div>
        </div>
      `,
    };

    // Send email notification
    await Promise.all([
      transporter.sendMail(mailOptions),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Mail data saved and notifications sent successfully",
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