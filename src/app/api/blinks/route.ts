import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    
    let data;
    try {
      data = await request.json();
      console.log('Received request data:', data);
    } catch  {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request format' 
        },
        { status: 400 }
      );
    }

  
    if (!data || !data.uniqueBlinkId || !data.codename || !data.email || !data.solanaKey || !data.askingFee) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    
    const existingBlink = await prisma.blink.findUnique({
      where: {
        uniqueBlinkId: data.uniqueBlinkId
      }
    });

    if (existingBlink) {
      return NextResponse.json(
        { 
          success: false,
          error: 'A blink with this ID already exists' 
        },
        { status: 409 }
      );
    }

  
    const blink = await prisma.blink.create({
      data: {
        uniqueBlinkId: data.uniqueBlinkId,
        codename: data.codename,
        email: data.email,
        solanaKey: data.solanaKey,
        askingFee: parseFloat(data.askingFee),
        description: data.description ?? '',
        imageUrl: data.imageUrl ?? null
      }
    });

    return NextResponse.json({
      success: true,
      data: blink
    });

  } catch (error) {
    console.error('Failed to create blink:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create blink'
      },
      { status: 500 }
    );
  }
}