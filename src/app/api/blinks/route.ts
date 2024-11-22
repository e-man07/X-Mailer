import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const blink = await prisma.blink.create({
      data: {
        uniqueBlinkId: data.uniqueBlinkId,
        codename: data.codename,
        email: data.email,
        solanaKey: data.solanaKey,
        description: data.description,
        imageUrl: data.imageUrl
      }
    });

    return NextResponse.json(blink);
  } catch (error) {
    console.error('Failed to create blink:', error);
    return NextResponse.json(
      { error: 'Failed to create blink' },
      { status: 500 }
    );
  }
}