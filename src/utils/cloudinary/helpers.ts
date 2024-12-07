import { CloudinarySignatureResponse } from './types';

export const generateCloudinarySignature = async (folder: string = 'blinks'): Promise<CloudinarySignatureResponse> => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  try {
    const response = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timestamp, folder }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get signature');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting signature:', error);
    throw error;
  }
};

export const uploadToCloudinary = async (
    file: File,
    signatureData: CloudinarySignatureResponse,
    onProgress?: (progress: number) => void
  ) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error('Cloudinary cloud name is not configured');
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', 'blinks');
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };