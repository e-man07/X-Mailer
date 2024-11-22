import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'blinks';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'gif', 'webp', 'jpeg'], // Add or remove formats as needed
      transformation: [
        { quality: 'auto:good' }, // Optimize quality
        { fetch_format: 'auto' }, // Auto-select best format
        { width: 1200, crop: 'limit' } // Limit max width while maintaining aspect ratio
      ]
    });

    return NextResponse.json({
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Optional: Set the maximum file size
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb' // Adjust this value as needed
    }
  }
};