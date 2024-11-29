import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Converting file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Uploading to Cloudinary
    const uploadResponse = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        fileStr,
        {
          folder: 'blinks',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'gif', 'webp', 'jpeg'],
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
            { width: 1200, crop: 'limit' }
          ]
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('No result from upload'));
        }
      );
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
};