import express from 'express';
import { signup, login, getMe } from '../controllers/authController';
import { validate } from '../middlewares/validationMiddleware';
import { signupSchema, loginSchema } from '../validators/authValidators';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Register a new user
router.post('/signup', validate(signupSchema), signup);

// Login user
router.post('/login', validate(loginSchema), login);

// Get current user profile
router.get('/me', protect, getMe);

export default router;