import { Router } from 'express';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', getMyNotifications);

// Must be before '/:id/read'
router.put('/read-all', markAllNotificationsRead);

router.put('/:id/read', markNotificationRead);
router.delete('/:id', deleteNotification);

export default router;