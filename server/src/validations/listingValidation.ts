import { z } from 'zod';
import { CATEGORIES, CONDITIONS } from '../models/Listing.js';

export const createListingSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2500, 'Description cannot exceed 2500 characters')
    .trim(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Invalid category' }),
  }),
  condition: z.enum(CONDITIONS, {
    errorMap: () => ({ message: 'Invalid condition' }),
  }),
  hostelArea: z.string().min(2, 'Hostel/campus location is required').trim(),
  images: z.array(z.string()).max(5, 'Maximum 5 images allowed').default([]),
  contactMethod: z.enum(['whatsapp', 'email', 'phone']).default('whatsapp'),
  contactInfo: z.string().min(2, 'Contact detail is required').trim(),
});

export const updateListingSchema = createListingSchema
  .partial()
  .extend({
    status: z.enum(['active', 'sold']).optional(),
  });

export const queryListingSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  condition: z.string().optional(),
  hostelArea: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'oldest']).default('newest'),
  status: z.enum(['active', 'sold', 'all']).default('active'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const reportListingSchema = z.object({
  reason: z.string().min(3, 'Please select a reason'),
  details: z.string().max(500).optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type QueryListingInput = z.infer<typeof queryListingSchema>;
