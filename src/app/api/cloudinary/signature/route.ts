// import { NextRequest, NextResponse } from 'next/server';
// import cloudinary from '@/lib/cloudinary/config';

// export async function POST(request: NextRequest) {
//   try {
//     const { timestamp, folder } = await request.json();

//     const signature = cloudinary.utils.api_sign_request(
//       {
//         timestamp,
//         folder,
//         upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
//       },
//       process.env.CLOUDINARY_API_SECRET!
//     );

//     return NextResponse.json({
//       signature,
//       timestamp,
//       cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//       apiKey: process.env.CLOUDINARY_API_KEY,
//     });
//   } catch (error) {
//     console.error('Signature generation error:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate signature' },
//       { status: 500 }
//     );
//   }
// }

import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "@/lib/cloudinary/config"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create an API route handler
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!file || !folder) {
    return new Response(JSON.stringify({ error: "Missing file or folder" }), {
      status: 400,
    });
  }

  try {
    const imageUrl = await uploadImage(file as File);
    return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      return new Response(
        JSON.stringify({ error: "An unknown error occurred" }),
        {
          status: 500,
        }
      );
    }
  }
}