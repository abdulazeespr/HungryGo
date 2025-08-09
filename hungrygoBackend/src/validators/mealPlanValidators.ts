import { z } from 'zod';

// Meal plan creation validation schema
export const createMealPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().optional(),
});

// Meal plan update validation schema
export const updateMealPlanSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  price: z.number().positive('Price must be a positive number').optional(),
  description: z.string().optional(),
});

// Meal plan ID param validation schema
export const mealPlanIdParamSchema = z.object({
  id: z.string().uuid('Invalid meal plan ID format'),
});

// Types derived from schemas
export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>;
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>;
export type MealPlanIdParam = z.infer<typeof mealPlanIdParamSchema>;