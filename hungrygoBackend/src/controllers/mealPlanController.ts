import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler';
import {
  CreateMealPlanInput,
  UpdateMealPlanInput,
  MealPlanIdParam,
} from '../validators/mealPlanValidators';

const prisma = new PrismaClient();

/**
 * Get all meal plans
 * @route GET /api/meal-plans
 */
export const getAllMealPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      include: {
        meals: true,
      },
    });

    res.status(200).json(mealPlans);
  } catch (error) {
    next(error);
  }
};

/**
 * Get meal plan by ID
 * @route GET /api/meal-plans/:id
 */
export const getMealPlanById = async (
  req: Request<MealPlanIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id },
      include: {
        meals: true,
      },
    });

    if (!mealPlan) {
      throw new ApiError(404, 'Meal plan not found');
    }

    res.status(200).json(mealPlan);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new meal plan (admin only)
 * @route POST /api/meal-plans
 */
export const createMealPlan = async (
  req: Request<{}, {}, CreateMealPlanInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const mealPlanData = req.body;

    const mealPlan = await prisma.mealPlan.create({
      data: mealPlanData,
    });

    res.status(201).json(mealPlan);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a meal plan (admin only)
 * @route PUT /api/meal-plans/:id
 */
export const updateMealPlan = async (
  req: Request<MealPlanIdParam, {}, UpdateMealPlanInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if meal plan exists
    const existingMealPlan = await prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!existingMealPlan) {
      throw new ApiError(404, 'Meal plan not found');
    }

    // Update meal plan
    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedMealPlan);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a meal plan (admin only)
 * @route DELETE /api/meal-plans/:id
 */
export const deleteMealPlan = async (
  req: Request<MealPlanIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if meal plan exists
    const existingMealPlan = await prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!existingMealPlan) {
      throw new ApiError(404, 'Meal plan not found');
    }

    // Delete meal plan
    await prisma.mealPlan.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};