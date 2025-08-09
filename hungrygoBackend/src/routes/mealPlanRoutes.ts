import express from 'express';
import {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from '../controllers/mealPlanController';
import { validate } from '../middlewares/validationMiddleware';
import {
  createMealPlanSchema,
  updateMealPlanSchema,
  mealPlanIdParamSchema,
} from '../validators/mealPlanValidators';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllMealPlans);
router.get(
  '/:id',
  validate(mealPlanIdParamSchema, 'params'),
  getMealPlanById
);

// Protected routes (admin only)
router.use(protect, restrictTo('admin'));

router.post('/', validate(createMealPlanSchema), createMealPlan);
router.put(
  '/:id',
  validate(mealPlanIdParamSchema, 'params'),
  validate(updateMealPlanSchema),
  updateMealPlan
);
router.delete(
  '/:id',
  validate(mealPlanIdParamSchema, 'params'),
  deleteMealPlan
);

export default router;