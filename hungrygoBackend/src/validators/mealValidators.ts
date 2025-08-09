import { z } from 'zod';

// Meal creation validation schema
export const createMealSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mealPlanId: z.string().uuid('Invalid meal plan ID format'),
});

// Meal update validation schema
export const updateMealSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mealPlanId: z.string().uuid('Invalid meal plan ID format').optional(),
});

// Meal ID param validation schema
export const mealIdParamSchema = z.object({
  id: z.string().uuid('Invalid meal ID format'),
});

// Types derived from schemas
export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
export type MealIdParam = z.infer<typeof mealIdParamSchema>;