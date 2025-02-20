import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryAdapter {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(fileBuffer: Buffer): Promise<string> {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${fileBuffer.toString('base64')}`  
    );
    return result.secure_url; 
  }
}