import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

// Constants for timeouts and retries
const DB_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries

// Helper function to add timeout to Prisma operations
const withTimeout = async <T>(
  operation: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Database operation timed out')), timeoutMs);
  });

  return Promise.race([operation, timeout]);
};

// Helper function for retrying operations
const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(`Retrying operation, ${retries} attempts remaining`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    // Parse request with timeout
    const data = await request.json();
    
    // Validate required fields
    if (!data || !data.uniqueBlinkId || !data.codename || !data.email || !data.solanaKey || !data.askingFee) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    // Check for existing blink with timeout and retry
    const existingBlink = await withRetry(async () => {
      return await withTimeout(
        prisma.blink.findUnique({
          where: {
            uniqueBlinkId: data.uniqueBlinkId
          }
        }),
        DB_TIMEOUT
      );
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

    // Create blink with timeout and retry
    const blink = await withRetry(async () => {
      return await withTimeout(
        prisma.blink.create({
          data: {
            uniqueBlinkId: data.uniqueBlinkId,
            codename: data.codename,
            email: data.email,
            solanaKey: data.solanaKey,
            askingFee: parseFloat(data.askingFee),
            description: data.description ?? '',
            imageUrl: data.imageUrl ?? null
          }
        }),
        DB_TIMEOUT
      );
    });

    return NextResponse.json({
      success: true,
      data: blink
    });

  } catch (error) {
    console.error('Failed to create blink:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Return specific error messages based on error type
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection error. Please try again.'
        },
        { status: 503 }
      );
    }

    if (error instanceof Error && error.message === 'Database operation timed out') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Request timed out. Please try again.'
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create blink'
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true,
  },
};