import { z } from 'zod';

export const STRATEGY_CONTEXT_MAX_LENGTH = 20000;

export const businessSchema = z.object({
  name: z
    .string({
      message: 'Business name is required',
    })
    .trim()
    .min(1, 'Business name is required')
    .max(200, 'Business name cannot exceed 200 characters'),
  category: z
    .string()
    .trim()
    .max(100, 'Category cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(50, 'Phone cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Please enter a valid email address',
    )
    .or(z.literal('')),
  website: z
    .string()
    .trim()
    .max(255, 'Website cannot exceed 255 characters')
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/i.test(val),
      'Please enter a valid website URL starting with http:// or https://',
    )
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(255, 'Address cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(100, 'City cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .trim()
    .max(100, 'State cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .max(100, 'Country cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  businessHours: z
    .string()
    .trim()
    .max(200, 'Business hours cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
  strategyDescription: z
    .string()
    .trim()
    .max(
      STRATEGY_CONTEXT_MAX_LENGTH,
      'Business strategy & context cannot exceed 20,000 characters',
    )
    .optional()
    .or(z.literal('')),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;
