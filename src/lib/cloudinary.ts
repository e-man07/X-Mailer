import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer: Buffer, folder: string = ""): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    ).end(buffer);
  });
}