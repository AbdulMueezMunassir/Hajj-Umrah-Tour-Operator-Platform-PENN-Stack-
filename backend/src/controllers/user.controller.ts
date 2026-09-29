import { Request, Response } from 'express';
import prisma from '../config/database';

// ==========================================
// GET ALL USERS (Admin)
// ==========================================
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 100, role, search } = req.query as any;

    const where: any = {};
    if (role) where.role = role;

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          whatsapp: true,
          address: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { bookings: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE USER (Admin)
// ==========================================
export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        whatsapp: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            package: {
              select: {
                id: true,
                name: true,
                type: true,
                travelDate: true,
                departureCity: true,
                posterUrl: true,
              },
            },
            travellersData: true,
            payments: { orderBy: { createdAt: 'desc' } },
          },
        },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE USER ROLE (Admin)
// ==========================================
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be USER or ADMIN',
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user },
    });
  } catch (error: any) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
};

// ==========================================
// GET USER STATS (Admin)
// ==========================================
export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [total, admins, users, recent] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: { total, admins, users, recent },
    });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message,
    });
  }
};