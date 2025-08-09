import { z } from 'zod';

// Payment intent creation validation schema
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  currency: z.string().min(3, 'Currency code must be at least 3 characters'),
  orderId: z.string().uuid('Invalid order ID format').optional(),
});

// Payment ID param validation schema
export const paymentIdParamSchema = z.object({
  id: z.string().uuid('Invalid payment ID format'),
});

// Webhook validation schema
export const webhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      amount: z.number(),
      currency: z.string(),
      status: z.string(),
    }),
  }),
});

// Types derived from schemas
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type PaymentIdParam = z.infer<typeof paymentIdParamSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;