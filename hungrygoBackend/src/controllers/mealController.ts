import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler';
import {
  CreateMealInput,
  UpdateMealInput,
  MealIdParam,
} from '../validators/mealValidators';

const prisma = new PrismaClient();

/**
 * Get all meals
 * @route GET /api/meals
 */
export const getAllMeals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const meals = await prisma.meal.findMany();
    res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};

/**
 * Get meal by ID
 * @route GET /api/meals/:id
 */
export const getMealById = async (
  req: Request<MealIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      throw new ApiError(404, 'Meal not found');
    }

    res.status(200).json(meal);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new meal (admin only)
 * @route POST /api/meals
 */
export const createMeal = async (
  req: Request<{}, {}, CreateMealInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const mealData = req.body;

    // Check if meal plan exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealData.mealPlanId },
    });

    if (!mealPlan) {
      throw new ApiError(404, 'Meal plan not found');
    }

    // Create meal
    const meal = await prisma.meal.create({
      data: mealData,
    });

    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a meal (admin only)
 * @route PUT /api/meals/:id
 */
export const updateMeal = async (
  req: Request<MealIdParam, {}, UpdateMealInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if meal exists
    const existingMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      throw new ApiError(404, 'Meal not found');
    }

    // Check if meal plan exists if updating meal plan ID
    if (updateData.mealPlanId) {
      const mealPlan = await prisma.mealPlan.findUnique({
        where: { id: updateData.mealPlanId },
      });

      if (!mealPlan) {
        throw new ApiError(404, 'Meal plan not found');
      }
    }

    // Update meal
    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedMeal);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a meal (admin only)
 * @route DELETE /api/meals/:id
 */
export const deleteMeal = async (
  req: Request<MealIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if meal exists
    const existingMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      throw new ApiError(404, 'Meal not found');
    }

    // Delete meal
    await prisma.meal.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    next(error);
  }
};