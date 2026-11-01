import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  hostelArea: z.string().min(2, 'Hostel or campus area is required'),
  roomNumber: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  preferredContactMethod: z.enum(['whatsapp', 'email', 'phone']).default('whatsapp'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
