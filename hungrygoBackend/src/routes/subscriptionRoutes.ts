import express from 'express';
import {
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
} from '../controllers/subscriptionController';
import { validate } from '../middlewares/validationMiddleware';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  subscriptionIdParamSchema,
} from '../validators/subscriptionValidators';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.get('/', getUserSubscriptions);
router.get(
  '/:id',
  validate(subscriptionIdParamSchema, 'params'),
  getSubscriptionById
);
router.post('/', validate(createSubscriptionSchema), createSubscription);
router.put(
  '/:id',
  validate(subscriptionIdParamSchema, 'params'),
  validate(updateSubscriptionSchema),
  updateSubscription
);
router.put(
  '/:id/cancel',
  validate(subscriptionIdParamSchema, 'params'),
  cancelSubscription
);
router.put(
  '/:id/pause',
  validate(subscriptionIdParamSchema, 'params'),
  pauseSubscription
);
router.put(
  '/:id/resume',
  validate(subscriptionIdParamSchema, 'params'),
  resumeSubscription
);

// Admin only routes
router.get('/admin/all', restrictTo('admin'), getAllSubscriptions);

export default router;