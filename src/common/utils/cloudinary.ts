import cloudinary from 'cloudinary';
import { randomBytes } from 'crypto';

export async function uploadFile(file: Express.Multer.File) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'products_images', public_id: randomBytes(16).toString('hex') },
      (error, result) => {
        if (error) return reject(error as Error);
        if (!result) return reject(new Error('No result'));
        resolve(result.secure_url);
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    uploadStream.end(Buffer.from(file.buffer));
  });
}
