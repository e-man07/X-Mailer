import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageFile: File): Promise<string> {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloundinary upload preset is not defined!");
  }

  console.log(`Image in Upload Image: ${imageFile.size}`)

  const imageBuffer = await imageFile.arrayBuffer();
  const base64String = Buffer.from(imageBuffer).toString("base64");

  try {
    const result = await cloudinary.uploader.upload(
      `data:${imageFile.type};base64,${base64String}`,
      {
        folder: "blinkImage",
        resource_type: "image",
        public_id: randomUUID(),
        upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
      }
    );

    console.log("This is result ---> ", result)

    return result.secure_url || "" ;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    
    throw new Error("Failed to upload image")  }
}

export default cloudinary;