import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { ApiError } from '../middlewares/errorHandler';
import {
  CreatePaymentIntentInput,
  PaymentIdParam,
  WebhookInput,
} from '../validators/paymentValidators';

// Add type declaration for req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role?: string;
      };
    }
  }
}

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

/**
 * Create a payment intent
 * @route POST /api/payments/create-intent
 */
export const createPaymentIntent = async (
  req: Request<{}, {}, CreatePaymentIntentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { amount, currency, orderId } = req.body;

    // If orderId is provided, verify it exists and belongs to the user
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      if (order.userId !== req.user.id && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized to access this order');
      }
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user.id,
        ...(orderId && { orderId }),
      },
    });

    // Create a payment record in the database
    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        orderId: orderId || '', // If no orderId, use empty string
        amount,
        status: 'pending',
      },
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment by ID
 * @route GET /api/payments/:id
 */
export const getPaymentById = async (
  req: Request<PaymentIdParam>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    // Check if user is authorized to view this payment
    if (req.user?.id !== payment.userId && req.user?.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to view this payment');
    }

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all payments for current user
 * @route GET /api/payments
 */
export const getUserPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all payments (admin only)
 * @route GET /api/payments/admin/all
 */
export const getAllPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Stripe webhook events
 * @route POST /api/payments/webhook
 */
export const handleWebhook = async (
  req: Request<{}, {}, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      throw new ApiError(400, 'Missing Stripe signature');
    }

    // Verify webhook signature
    let event;
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
      // req.body is already raw because of express.raw middleware
      const payload = req.body;
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
      throw new ApiError(400, `Webhook Error: ${(err as Error).message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { userId, orderId } = paymentIntent.metadata;

  // Update payment status in database
  if (userId && orderId) {
    // Find payment by orderId and userId
    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        orderId,
      },
    });

    if (payment) {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'completed' },
      });

      // Update order status if applicable
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'confirmed' },
      });
    }
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { userId, orderId } = paymentIntent.metadata;

  // Update payment status in database
  if (userId && orderId) {
    // Find payment by orderId and userId
    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        orderId,
      },
    });

    if (payment) {
      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
    }
  }
}