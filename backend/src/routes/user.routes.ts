import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUserRole,
  getUserStats,
} from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// All routes require auth + admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Get user stats
router.get('/stats', getUserStats);

// Get all users
router.get('/', getAllUsers);

// Get single user
router.get('/:id', getUser);

// Update user role
router.put('/:id/role', updateUserRole);

export default router;