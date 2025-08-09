import { z } from 'zod';

// Order meal schema
const orderMealSchema = z.object({
  mealId: z.string().uuid('Invalid meal ID format'),
  day: z.string().min(1, 'Day is required'),
  type: z.string().min(1, 'Type is required'),
});

// Order creation validation schema
export const createOrderSchema = z.object({
  planId: z.string().uuid('Invalid meal plan ID format'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  meals: z.array(orderMealSchema).optional(),
});

// Order update validation schema
export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'delivered', 'cancelled']).optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
});

// Order ID param validation schema
export const orderIdParamSchema = z.object({
  id: z.string().uuid('Invalid order ID format'),
});

// Types derived from schemas
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;