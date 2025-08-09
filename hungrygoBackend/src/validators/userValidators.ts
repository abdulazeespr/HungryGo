import { z } from 'zod';

// User update validation schema
export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  status: z.enum(['active', 'inactive']).optional(),
  role: z.enum(['customer', 'admin', 'agent']).optional(),
});

// User ID param validation schema
export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

// Types derived from schemas
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;