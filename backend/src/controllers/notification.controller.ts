import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================
export const getMyNotifications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const limit = Math.min(parseInt(String(req.query.limit)) || 50, 100);
    const unreadOnly = req.query.unread === 'true';

    const where: any = { userId: req.user.userId };
    if (unreadOnly) where.read = false;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: req.user.userId, read: false },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// ==========================================
// MARK ONE AS READ
// ==========================================
export const markNotificationRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;

    const result = await prisma.notification.updateMany({
      where: { id, userId: req.user.userId },
      data: { read: true },
    });

    if (result.count === 0) {
      res
        .status(404)
        .json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error: any) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message,
    });
  }
};

// ==========================================
// MARK ALL AS READ
// ==========================================
export const markAllNotificationsRead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    await prisma.notification.updateMany({
      where: { userId: req.user.userId, read: false },
      data: { read: true },
    });

    res.status(200).json({ success: true, message: 'All marked as read' });
  } catch (error: any) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message,
    });
  }
};

// ==========================================
// DELETE ONE
// ==========================================
export const deleteNotification = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;

    const result = await prisma.notification.deleteMany({
      where: { id, userId: req.user.userId },
    });

    if (result.count === 0) {
      res
        .status(404)
        .json({ success: false, message: 'Notification not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};