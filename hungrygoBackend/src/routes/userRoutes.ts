import express from 'express';
import {
  getUserById,
  updateUser,
  getAllUsers,
  deleteUser,
} from '../controllers/userController';
import { validate } from '../middlewares/validationMiddleware';
import {
  updateUserSchema,
  userIdParamSchema,
} from '../validators/userValidators';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get user by ID
router.get(
  '/:id',
  validate(userIdParamSchema, 'params'),
  getUserById
);

// Update user
router.put(
  '/:id',
  validate(userIdParamSchema, 'params'),
  validate(updateUserSchema),
  updateUser
);

// Admin only routes
router.use(restrictTo('admin'));

// Get all users
router.get('/', getAllUsers);

// Delete user
router.delete(
  '/:id',
  validate(userIdParamSchema, 'params'),
  deleteUser
);

export default router;