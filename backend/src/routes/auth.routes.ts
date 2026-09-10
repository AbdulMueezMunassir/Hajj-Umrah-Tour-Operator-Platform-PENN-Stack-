import { Router } from 'express';
import {
  register,
  login,
  getMe,
  changePassword,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  registerValidation,
  loginValidation,
} from '../utils/validationSchemas';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, changePassword);

export default router;