import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { uniqueBlinkId: string } }) {
  try {
    const { uniqueBlinkId } = params;

    const blink = await prisma.blink.findUnique({
      where: { uniqueBlinkId },
    });

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    return NextResponse.json(blink);
  } catch (error) {
    console.error('Failed to fetch blink:', error);
    return NextResponse.json({ error: 'Failed to fetch blink' }, { status: 500 });
  }
}