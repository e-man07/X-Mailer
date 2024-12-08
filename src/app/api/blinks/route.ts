import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/cloudinary/config';

export async function POST(request: NextRequest) {
  try {
    
    const data = await request.formData();
    const blinkId = nanoid()

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
    
    const imageLink = await uploadImage(image )
    console.log(`Image: ${imageLink}`)

    if(!imageLink){
       return NextResponse.json({ status: 403, error: "The imagelink is not valid!"})
    }
    

      const newBlink = await prisma.blink.create({
        data: {
          uniqueBlinkId: blinkId,
          codename, 
          email,
          solanaKey,
          askingFee,
          description: description ?? '',
          imageUrl: imageLink
        },
    });

      console.log(`Blink Data: ${newBlink}`)

      return NextResponse.json({
        success: true,
        blink: newBlink
      });

  } catch (error) {
    console.error('Failed to create blink:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create blinkssssss'
      },
      { status: 500 }
    );
  }
}