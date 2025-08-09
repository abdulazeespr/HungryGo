import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middlewares/errorHandler';
import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SubscriptionIdParam,
} from '../validators/subscriptionValidators';

const prisma = new PrismaClient();

/**
 * Get all subscriptions for current user
 * @route GET /api/subscriptions
 */
export const getUserSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      include: {
        mealPlan: true,
      },
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all subscriptions (admin only)
 * @route GET /api/subscriptions/all
 */
export const getAllSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        mealPlan: true,
      },
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get subscription by ID
 * @route GET /api/subscriptions/:id
 */
export const getSubscriptionById = async (
  req: Request<SubscriptionIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        mealPlan: true,
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    // Check if user is authorized to view this subscription
    if (
      req.user?.id !== subscription.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(
        403,
        'Not authorized to view this subscription'
      );
    }

    res.status(200).json(subscription);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new subscription
 * @route POST /api/subscriptions
 */
export const createSubscription = async (
  req: Request<{}, {}, CreateSubscriptionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { planId, startDate } = req.body;

    // Check if meal plan exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: planId },
    });

    if (!mealPlan) {
      throw new ApiError(404, 'Meal plan not found');
    }

    // Check if user already has an active subscription for this plan
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        mealPlanId: planId,
        status: 'active',
      },
    });

    if (existingSubscription) {
      throw new ApiError(400, 'Already subscribed to this plan');
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        mealPlanId: planId,
        status: 'active',
        startDate: startDate ? new Date(startDate) : new Date(),
      },
    });

    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a subscription
 * @route PUT /api/subscriptions/:id
 */
export const updateSubscription = async (
  req: Request<SubscriptionIdParam, {}, UpdateSubscriptionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    // Check if user is authorized to update this subscription
    if (
      req.user?.id !== existingSubscription.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(
        403,
        'Not authorized to update this subscription'
      );
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.endDate && { endDate: new Date(updateData.endDate) }),
      },
    });

    res.status(200).json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a subscription
 * @route PUT /api/subscriptions/:id/cancel
 */
export const cancelSubscription = async (
  req: Request<SubscriptionIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    // Check if user is authorized to cancel this subscription
    if (
      req.user?.id !== existingSubscription.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(
        403,
        'Not authorized to cancel this subscription'
      );
    }

    // Update subscription status to cancelled
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'cancelled',
        endDate: new Date(),
      },
    });

    res.status(200).json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

/**
 * Pause a subscription
 * @route PUT /api/subscriptions/:id/pause
 */
export const pauseSubscription = async (
  req: Request<SubscriptionIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    // Check if user is authorized to pause this subscription
    if (
      req.user?.id !== existingSubscription.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(
        403,
        'Not authorized to pause this subscription'
      );
    }

    // Check if subscription is active
    if (existingSubscription.status !== 'active') {
      throw new ApiError(400, 'Can only pause active subscriptions');
    }

    // Update subscription status to paused
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'paused',
      },
    });

    res.status(200).json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

/**
 * Resume a subscription
 * @route PUT /api/subscriptions/:id/resume
 */
export const resumeSubscription = async (
  req: Request<SubscriptionIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    // Check if user is authorized to resume this subscription
    if (
      req.user?.id !== existingSubscription.userId &&
      req.user?.role !== 'admin'
    ) {
      throw new ApiError(
        403,
        'Not authorized to resume this subscription'
      );
    }

    // Check if subscription is paused
    if (existingSubscription.status !== 'paused') {
      throw new ApiError(400, 'Can only resume paused subscriptions');
    }

    // Update subscription status to active
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'active',
      },
    });

    res.status(200).json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};