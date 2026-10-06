import prisma from '../config/database';

export type NotificationType = 'BOOKING' | 'PAYMENT' | 'SYSTEM';

/**
 * Creates an in-app notification for a user.
 * Never throws - a failed notification must not break the main request.
 */
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'SYSTEM'
): Promise<void> => {
  try {
    await prisma.notification.create({
      data: { userId, title, message, type },
    });
  } catch (error) {
    console.error('Create notification error:', error);
  }
};