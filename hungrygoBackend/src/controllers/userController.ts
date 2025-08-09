import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler';
import { UpdateUserInput, UserIdParam } from '../validators/userValidators';

const prisma = new PrismaClient();

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (
  req: Request<UserIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/users/:id
 */
export const updateUser = async (
  req: Request<UserIdParam, {}, UpdateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    // Check if user is trying to update someone else's profile
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to update this user');
    }

    // Prevent non-admins from changing roles
    if (updateData.role && req.user?.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to change role');
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (admin only)
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (
  req: Request<UserIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};