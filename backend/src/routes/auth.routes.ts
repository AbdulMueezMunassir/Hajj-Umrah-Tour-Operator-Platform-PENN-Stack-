import { Router } from 'express';
import {
  register,
  login,
  getMe,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { rateLimit } from '../middleware/rateLimit';
import {
  registerValidation,
  loginValidation,
} from '../utils/validationSchemas';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post(
  '/forgot-password',
  rateLimit(5, 15 * 60 * 1000),
  forgotPassword
);
router.post(
  '/reset-password',
  rateLimit(10, 15 * 60 * 1000),
  resetPassword
);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, changePassword);
router.put('/profile', authMiddleware, updateProfile);

export default router;