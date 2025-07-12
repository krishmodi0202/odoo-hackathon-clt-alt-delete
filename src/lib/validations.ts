import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const itemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  size: z.string().min(1, 'Size is required'),
  condition: z.string().min(1, 'Condition is required'),
  tags: z.array(z.string()).optional(),
  pointsValue: z.number().min(1, 'Points value must be at least 1'),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type ProfileInput = z.infer<typeof profileSchema>; 