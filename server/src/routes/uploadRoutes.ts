import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { upload } from '../middlewares/uploadMiddleware.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const router = Router();

router.post(
  '/',
  requireAuth,
  upload.array('images', 5),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No images provided for upload',
        });
        return;
      }

      const useCloudinary = isCloudinaryConfigured();
      let fileUrls: string[] = [];

      if (useCloudinary) {
        // Upload concurrently to Cloudinary
        fileUrls = await Promise.all(
          files.map((file) => uploadBufferToCloudinary(file.buffer))
        );
      } else {
        // Save to local disk fallback
        const host = req.get('host');
        const protocol = req.protocol;

        fileUrls = files.map((file) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
          const filename = `item-${uniqueSuffix}${ext}`;
          const filePath = path.join(uploadDir, filename);

          fs.writeFileSync(filePath, file.buffer);
          return `${protocol}://${host}/uploads/${filename}`;
        });
      }

      res.status(200).json({
        success: true,
        message: `${files.length} image(s) uploaded successfully via ${
          useCloudinary ? 'Cloudinary' : 'Local Storage'
        }`,
        data: {
          urls: fileUrls,
          storage: useCloudinary ? 'cloudinary' : 'local',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
