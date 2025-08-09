import express from 'express';
import {
  createPaymentIntent,
  getPaymentById,
  getUserPayments,
  getAllPayments,
  handleWebhook,
} from '../controllers/paymentController';
import { validate } from '../middlewares/validationMiddleware';
import {
  createPaymentIntentSchema,
  paymentIdParamSchema,
} from '../validators/paymentValidators';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Webhook route (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(protect);

// User routes
router.post('/create-intent', validate(createPaymentIntentSchema), createPaymentIntent);
router.get('/', getUserPayments);
router.get(
  '/:id',
  validate(paymentIdParamSchema, 'params'),
  getPaymentById
);

// Admin only routes
router.get('/admin/all', restrictTo('admin'), getAllPayments);

export default router;