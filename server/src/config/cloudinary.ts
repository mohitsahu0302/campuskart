import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';

const isConfigured = Boolean(
  ENV.CLOUDINARY_CLOUD_NAME &&
    ENV.CLOUDINARY_API_KEY &&
    ENV.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('[Cloudinary] Configured successfully for cloud storage');
} else {
  console.log('[Cloudinary] Keys not provided, defaulting to local disk uploads');
}

export const isCloudinaryConfigured = (): boolean => isConfigured;

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder = 'campuskart'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('No result from Cloudinary upload stream'));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
