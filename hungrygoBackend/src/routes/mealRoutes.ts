import express from 'express';
import {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} from '../controllers/mealController';
import { validate } from '../middlewares/validationMiddleware';
import {
  createMealSchema,
  updateMealSchema,
  mealIdParamSchema,
} from '../validators/mealValidators';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllMeals);
router.get(
  '/:id',
  validate(mealIdParamSchema, 'params'),
  getMealById
);

// Protected routes (admin only)
router.use(protect, restrictTo('admin'));

router.post('/', validate(createMealSchema), createMeal);
router.put(
  '/:id',
  validate(mealIdParamSchema, 'params'),
  validate(updateMealSchema),
  updateMeal
);
router.delete(
  '/:id',
  validate(mealIdParamSchema, 'params'),
  deleteMeal
);

export default router;