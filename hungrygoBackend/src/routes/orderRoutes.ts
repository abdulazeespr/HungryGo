import express from 'express';
import {
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder,
} from '../controllers/orderController';
import { validate } from '../middlewares/validationMiddleware';
import {
  createOrderSchema,
  updateOrderSchema,
  orderIdParamSchema,
} from '../validators/orderValidators';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.get('/', getUserOrders);
router.get(
  '/:id',
  validate(orderIdParamSchema, 'params'),
  getOrderById
);
router.post('/', validate(createOrderSchema), createOrder);
router.put(
  '/:id',
  validate(orderIdParamSchema, 'params'),
  validate(updateOrderSchema),
  updateOrder
);
router.put(
  '/:id/cancel',
  validate(orderIdParamSchema, 'params'),
  cancelOrder
);

// Admin only routes
router.get('/admin/all', restrictTo('admin'), getAllOrders);

export default router;