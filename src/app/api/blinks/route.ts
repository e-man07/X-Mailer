import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary/config';
import { sendBlinkCreationEmail } from '@/lib/nodemailer/config';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const blinkId = nanoid()
    const analyticsId = nanoid(10) // Generate a shorter, user-friendly analytics ID

    const codename = data.get("codename") as string
    const email = data.get("email") as string
    const solanaKey = data.get("solanaKey") as string
    const askingFee = parseFloat(data.get("askingFee") as unknown as string)
    const description = data.get("description") as string
    const image = data.get("image") as File

    if (!data || !codename || !email || !solanaKey || !askingFee || !image) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }
    
    const imageLink = await uploadImage(image)
    console.log(`Image: ${imageLink}`)

    if(!imageLink){
      return NextResponse.json(
        { 
          success: false,
          error: "The image upload failed!"
        },
        { status: 403 }
      )
    }

    // Create the blink with analytics ID
    const newBlink = await prisma.blink.create({
      data: {
        uniqueBlinkId: blinkId,
        analyticsId,
        codename, 
        email,
        solanaKey,
        askingFee,
        description: description ?? '',
        imageUrl: imageLink,
        analytics: {
          create: {
            totalVisits: 0,
            totalMails: 0,
            earnings: 0,
            visitorLocations: {},
            mailTimestamps: []
          }
        }
      }
    });

    // Send confirmation email with both blinkId and analyticsId
    try {
      await sendBlinkCreationEmail(email, blinkId, analyticsId, codename);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue execution even if email fails - the blink was created successfully
    }

    return NextResponse.json({ 
      success: true,
      blinkId,
      analyticsId
    });
    
  } catch (error) {
    console.error('Error creating blink:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create blink"
      },
      { status: 500 }
    );
  }
}

// Endpoint to get blink details by uniqueBlinkId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uniqueBlinkId = searchParams.get('uniqueBlinkId');

    if (!uniqueBlinkId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing blink ID' 
        },
        { status: 400 }
      );
    }

    const blink = await prisma.blink.findUnique({
      where: {
        uniqueBlinkId: uniqueBlinkId
      },
      select: {
        id: true,
        codename: true,
        askingFee: true,
        imageUrl: true,
        description: true,
        solanaKey: true
      }
    });

    if (!blink) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Blink not found' 
        },
        { status: 404 }
      );
    }

    // If blink is found, increment the visit counter in analytics
    await prisma.analytics.update({
      where: {
        blinkId: blink.id
      },
      data: {
        totalVisits: {
          increment: 1
        },
        lastVisited: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      blink 
    });

  } catch (error) {
    console.error('Error fetching blink:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch blink' 
      },
      { status: 500 }
    );
  }
}