import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Params are a Promise now
) {
  try {
    // Await the params Promise to get the 'id' value
    const { id } = await context.params; 

    console.log('Searching for analytics with ID:', id);

    // Find the blink with related data
    const blink = await prisma.blink.findFirst({
      where: {
        analyticsId: id,
      },
      include: {
        analytics: true,
        mails: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!blink) {
      console.log('No blink found with analyticsId:', id);
      return NextResponse.json(
        { error: 'Blink not found with this analytics ID' },
        { status: 404 }
      );
    }

    console.log('Found blink:', blink.id);

    // Calculate total mails and earnings
    const mailCount = await prisma.mail.count({
      where: {
        blinkId: blink.id,
      },
    });

    const totalEarnings = Number(blink.askingFee) * mailCount;

    if (!blink.analytics) {
      // Create analytics if it doesn't exist
      const analytics = await prisma.analytics.create({
        data: {
          blink: { connect: { id: blink.id } },
          totalVisits: 0,
          totalMails: mailCount,
          lastVisited: new Date(),
          earnings: totalEarnings,
          visitorLocations: {},
          mailTimestamps: blink.mails.map((mail) => mail.createdAt),
        },
      });

      console.log('Created new analytics:', analytics.id);

      return NextResponse.json({
        success: true,
        analytics: {
          totalVisits: 0,
          totalMails: mailCount,
          lastVisited: new Date(),
          earnings: totalEarnings,
          visitorLocations: {},
          mailTimestamps: blink.mails.map((mail) => mail.createdAt),
          blinkCreator: blink.codename,
        },
      });
    }

    // Update analytics with current mail count and earnings
    const updatedAnalytics = await prisma.analytics.update({
      where: { id: blink.analytics.id },
      data: {
        totalMails: mailCount,
        earnings: totalEarnings,
        mailTimestamps: blink.mails.map((mail) => mail.createdAt),
      },
    });

    console.log('Returning analytics data with', blink.mails.length, 'mail timestamps');

    return NextResponse.json({
      success: true,
      analytics: {
        totalVisits: updatedAnalytics.totalVisits,
        totalMails: mailCount,
        lastVisited: updatedAnalytics.lastVisited,
        earnings: totalEarnings,
        visitorLocations: updatedAnalytics.visitorLocations || {},
        mailTimestamps: blink.mails.map((mail) => mail.createdAt),
        blinkCreator: blink.codename,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Params are a Promise now
) {
  try {
    // Await the params Promise to get the 'id' value
    const { id } = await context.params; 

    const blink = await prisma.blink.findFirst({
      where: {
        analyticsId: id,
      },
      include: {
        analytics: true,
        mails: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!blink) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 });
    }

    // Calculate total mails and earnings
    const mailCount = await prisma.mail.count({
      where: {
        blinkId: blink.id,
      },
    });

    const totalEarnings = Number(blink.askingFee) * mailCount;

    // Create or update analytics
    if (!blink.analytics) {
      const analytics = await prisma.analytics.create({
        data: {
          blink: { connect: { id: blink.id } },
          totalVisits: 1,
          totalMails: mailCount,
          lastVisited: new Date(),
          earnings: totalEarnings,
          visitorLocations: {},
          mailTimestamps: blink.mails.map((mail) => mail.createdAt),
        },
      });

      return NextResponse.json({
        success: true,
        analytics: {
          totalVisits: 1,
          totalMails: mailCount,
          lastVisited: new Date(),
          earnings: totalEarnings,
          visitorLocations: {},
          mailTimestamps: blink.mails.map((mail) => mail.createdAt),
          blinkCreator: blink.codename,
        },
      });
    } else {
      const updated = await prisma.analytics.update({
        where: { id: blink.analytics.id },
        data: {
          totalVisits: { increment: 1 },
          totalMails: mailCount,
          lastVisited: new Date(),
          earnings: totalEarnings,
          mailTimestamps: blink.mails.map((mail) => mail.createdAt),
        },
      });

      return NextResponse.json({
        success: true,
        analytics: {
          totalVisits: updated.totalVisits,
          totalMails: mailCount,
          lastVisited: updated.lastVisited,
          earnings: totalEarnings,
          visitorLocations: updated.visitorLocations || {},
          mailTimestamps: blink.mails.map((mail) => mail.createdAt),
          blinkCreator: blink.codename,
        },
      });
    }
  } catch (error) {
    console.error('Error updating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to update analytics data' },
      { status: 500 }
    );
  }
}
