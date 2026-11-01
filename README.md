# 📌 CampusKart

> **A student-to-student marketplace web app styled like a campus notice board.**
> Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS, Express + TypeScript, and MongoDB + Mongoose.

---

## 🎨 Notice Board Concept & Design System

CampusKart rejects generic e-commerce templates in favor of a warm, authentic **Campus Notice Board** aesthetic:
- **Index Card Listings**: Pinned paper slips with subtle random rotations (-1.5° to 1.5°) that gently straighten and lift on hover.
- **Pushpins & Washi Tape**: Pinned with metallic brass, vermilion, and slate pushpins or semi-transparent washi tape strips.
- **Distressed Rubber Stamp**: Sold items are stamped with a bold, rotated red rubber stamp.
- **Handwritten Annotations**: Caveat handwriting font for notes like hostel room location and condition details.
- **Warm Off-White Paper Palette**: `#FAF6EE`, `#FCFBF8`, deep ink typography, vermilion tomato accents, and subtle cork textures.
- **Polaroid Photo Galleries**: Item detail views display pictures stacked and framed like real Polaroids with handwriting labels.
- **Sticky-Note Toasts**: Notifications look like yellow sticky notes with a folded bottom-right corner.

---

## ☁️ Cloud Services & Production Deployment (Vercel + MongoDB Atlas + Cloudinary)

### 1. MongoDB Atlas Setup (Free Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free **M0 cluster**.
2. Under **Database Access**, create a user with read/write privileges (e.g. `campus_admin` and a strong password).
3. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)** (required for Vercel's dynamic serverless IP ranges).
4. Go to **Clusters** -> click **Connect** -> choose **Drivers** (Node.js) -> copy your connection string:
   ```
   mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/campuskart?retryWrites=true&w=majority
   ```
5. *(Optional)* Seed your Atlas database with the 32 demo listings:
   ```bash
   cd server
   $env:MONGODB_URI="mongodb+srv://campus_admin:<password>@cluster0.abcde.mongodb.net/campuskart?retryWrites=true&w=majority"
   npm run seed
   ```

---

### 2. Cloudinary Setup (Image CDN for Vercel)
Vercel serverless functions have an ephemeral, read-only filesystem, so product photos are stored permanently in Cloudinary:
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy:
   - **Cloud Name** (`CLOUDINARY_CLOUD_NAME`)
   - **API Key** (`CLOUDINARY_API_KEY`)
   - **API Secret** (`CLOUDINARY_API_SECRET`)

*(In local development without Cloudinary credentials, the app automatically falls back to saving files in `/uploads` on disk).*

---

### 3. Deploying to Vercel

You can deploy the frontend and backend to Vercel in just a few minutes using the Vercel Dashboard or Vercel CLI:

#### A. Deploy the Backend (`/server`)
1. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
2. Configure project settings:
   - **Project Name**: `campuskart-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://...` (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: `your_jwt_production_secret_key`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://your-campuskart-client.vercel.app` (Or `*` temporarily)
   - `CLOUDINARY_CLOUD_NAME`: `your_cloud_name`
   - `CLOUDINARY_API_KEY`: `your_api_key`
   - `CLOUDINARY_API_SECRET`: `your_api_secret`
4. Click **Deploy**. Note down your deployed API URL (e.g. `https://campuskart-api.vercel.app`).

#### B. Deploy the Frontend (`/client`)
1. In Vercel, import the same repository as a new project.
2. Configure project settings:
   - **Project Name**: `campuskart`
   - **Root Directory**: `client`
   - **Framework Preset**: `Next.js`
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://campuskart-api.vercel.app/api`
4. Click **Deploy**.
5. Once deployed, update `CLIENT_URL` in your backend Vercel project settings to match your new frontend domain (`https://campuskart.vercel.app`) for strict CORS security.

---

## 💻 Local Development Quickstart

### Prerequisites
1. **Node.js**: v18+ (tested on Node.js v24)
2. **MongoDB**: Local MongoDB instance on port 27017 or a MongoDB Atlas URI

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed     # Populates 3 demo campus users + 32 realistic listings
npm run dev      # Starts server on http://localhost:5000
```

#### Demo Accounts (Pre-seeded):
| Email | Password | Role / Hostel |
|---|---|---|
| `aravind@campus.edu` | `campuspassword123` | Hostel 4 (C-Block) |
| `ananya.r@campus.edu` | `campuspassword123` | Sarojini Bhawan (Block B) |
| `kabir.m@campus.edu` | `campuspassword123` | Hostel 9 (Mess Side) |

*(One-click autofill buttons are available on the login page for convenience!)*

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev      # Starts Next.js app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Automated Tests

To run the complete automated integration test suite against the live services:
```bash
node test-flow.mjs
```
Verifies health check, search and category filters, authentication, cookie persistence, image upload, listing creation, contact masking/unmasking, sold rubber stamp toggle, edit, wishlist, report listing, and deletion.
