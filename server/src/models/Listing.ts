import mongoose, { Document, Schema, Types } from 'mongoose';

export const CATEGORIES = [
  'Books',
  'Cycles',
  'Gadgets',
  'Hostel Essentials',
  'Furniture',
  'Other',
] as const;

export type ListingCategory = (typeof CATEGORIES)[number];

export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'] as const;
export type ListingCondition = (typeof CONDITIONS)[number];

export interface IListing extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: ListingCondition;
  hostelArea: string;
  images: string[];
  sellerId: Types.ObjectId;
  sellerName: string;
  contactMethod: 'whatsapp' | 'email' | 'phone';
  contactInfo: string;
  status: 'active' | 'sold';
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2500,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
      index: true,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: CONDITIONS,
      index: true,
    },
    hostelArea: {
      type: String,
      required: [true, 'Hostel or campus area is required'],
      trim: true,
      index: true,
    },
    images: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 5,
        'Cannot upload more than 5 images',
      ],
      default: [],
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    contactMethod: {
      type: String,
      enum: ['whatsapp', 'email', 'phone'],
      default: 'whatsapp',
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold'],
      default: 'active',
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
ListingSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 3, description: 1 }, name: 'TextSearchIndex' }
);

// Compound indexes for fast filtering and sorting
ListingSchema.index({ status: 1, createdAt: -1 });
ListingSchema.index({ category: 1, status: 1, price: 1 });
ListingSchema.index({ status: 1, price: 1 });
ListingSchema.index({ hostelArea: 1, status: 1 });

export const Listing = mongoose.model<IListing>('Listing', ListingSchema);
