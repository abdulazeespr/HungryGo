import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler';
import {
  CreateOrderInput,
  UpdateOrderInput,
  OrderIdParam,
} from '../validators/orderValidators';

const prisma = new PrismaClient();

/**
 * Get all orders for current user
 * @route GET /api/orders
 */
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        mealPlan: true,
        orderMeals: {
          include: {
            meal: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders (admin only)
 * @route GET /api/orders/all
 */
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        mealPlan: true,
        orderMeals: {
          include: {
            meal: true,
          },
        },
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 */
export const getOrderById = async (
  req: Request<OrderIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        mealPlan: true,
        orderMeals: {
          include: {
            meal: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Check if user is authorized to view this order
    if (req.user?.id !== order.userId && req.user?.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to view this order');
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new order
 * @route POST /api/orders
 */
export const createOrder = async (
  req: Request<{}, {}, CreateOrderInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { planId, startDate, meals } = req.body;

    // Check if meal plan exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: planId },
      include: {
        meals: true,
      },
    });

    if (!mealPlan) {
      throw new ApiError(404, 'Meal plan not found');
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        mealPlanId: planId,
        status: 'pending',
        createdAt: new Date(),
        orderMeals: {
          create: meals?.map((meal) => ({
            mealId: meal.mealId,
            day: meal.day,
            type: meal.type,
          })),
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an order
 * @route PUT /api/orders/:id
 */
export const updateOrder = async (
  req: Request<OrderIdParam, {}, UpdateOrderInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new ApiError(404, 'Order not found');
    }

    // Check if user is authorized to update this order
    if (
      req.user?.id !== existingOrder.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(403, 'Not authorized to update this order');
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel an order
 * @route PUT /api/orders/:id/cancel
 */
export const cancelOrder = async (
  req: Request<OrderIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new ApiError(404, 'Order not found');
    }

    // Check if user is authorized to cancel this order
    if (
      req.user?.id !== existingOrder.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(403, 'Not authorized to cancel this order');
    }

    // Check if order can be cancelled
    if (existingOrder.status === 'delivered') {
      throw new ApiError(400, 'Cannot cancel a delivered order');
    }

    // Update order status to cancelled
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};