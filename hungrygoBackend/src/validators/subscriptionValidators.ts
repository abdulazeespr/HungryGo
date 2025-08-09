import { z } from 'zod';

// Subscription creation validation schema
export const createSubscriptionSchema = z.object({
  planId: z.string().uuid('Invalid meal plan ID format'),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
});

// Subscription update validation schema
export const updateSubscriptionSchema = z.object({
  status: z.enum(['active', 'paused', 'cancelled']).optional(),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
});

// Subscription ID param validation schema
export const subscriptionIdParamSchema = z.object({
  id: z.string().uuid('Invalid subscription ID format'),
});

// Types derived from schemas
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type SubscriptionIdParam = z.infer<typeof subscriptionIdParamSchema>;