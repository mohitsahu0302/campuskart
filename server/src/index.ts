import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers with resource policy allowing static images to load in frontend
app.use(
  (helmet as any)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Ensure MongoDB is connected before handling any route (essential for Vercel Serverless)
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// CORS configuration for client origin and cookies
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const corsFn: any = typeof cors === 'function' ? cors : (cors as any).default || cors;
const cookieParserFn: any =
  typeof cookieParser === 'function'
    ? cookieParser
    : (cookieParser as any).default || cookieParser;

app.use(
  corsFn({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow requests with no origin (like mobile apps, curl, or serverless rewrites)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev & flexible cloud origin fallback
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParserFn());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded images
const uploadDir = path.resolve(__dirname, '../uploads');
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(uploadDir)
);

// General rate limiter on API
app.use('/api', apiRateLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'CampusKart API',
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Catch-all 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on CampusKart noticeboard server`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Standalone server startup (runs when not in Vercel serverless environment)
if (process.env.VERCEL !== '1') {
  const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(`📌 CampusKart Server running on http://localhost:${ENV.PORT}`);
      console.log(`📁 Uploads served at http://localhost:${ENV.PORT}/uploads/`);
    });
  };

  startServer().catch((err) => {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  });
}

export default app;
