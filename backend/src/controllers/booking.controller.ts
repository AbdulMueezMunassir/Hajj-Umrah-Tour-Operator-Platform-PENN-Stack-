import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import {
  generateBookingRef,
  calculateBookingPrices,
  checkSeatAvailability,
} from '../services/booking.service';

// ==========================================
// CREATE BOOKING (User)
// ==========================================
export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { packageId, travellers } = req.body;

    // Validate travellers
    if (!Array.isArray(travellers) || travellers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one traveller is required',
      });
      return;
    }

    // Get package
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    if (pkg.status !== 'ACTIVE') {
      res.status(400).json({
        success: false,
        message: 'This package is not available for booking',
      });
      return;
    }

    // Check seat availability
    const { available, seatsLeft } = await checkSeatAvailability(
      packageId,
      travellers.length
    );

    if (!available) {
      res.status(400).json({
        success: false,
        message: `Only ${seatsLeft} seat(s) available, but ${travellers.length} requested`,
      });
      return;
    }

    // Calculate prices
    const { totalAmount, advancePaid, balanceDue } = calculateBookingPrices(
      pkg.totalPrice,
      pkg.advancePercent,
      travellers.length
    );

    // Generate booking reference
    const bookingRef = await generateBookingRef(pkg.type);

    // Create booking with travellers
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        userId: req.user.userId,
        packageId,
        travellers: travellers, // Store as JSON
        totalAmount,
        advancePaid,
        balanceDue,
        bookingStatus: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        travellersData: {
          create: travellers.map((t: any) => ({
            fullName: t.fullName,
            passportNumber: t.passportNumber,
            dateOfBirth: new Date(t.dateOfBirth),
            gender: t.gender,
            relationship: t.relationship || null,
            nic: t.nic || null,
            phone: t.phone || null,
          })),
        },
      },
      include: {
        package: true,
        travellersData: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        paymentSummary: {
          totalAmount,
          advancePaid,
          balanceDue,
          advancePercent: pkg.advancePercent,
        },
      },
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};

// ==========================================
// GET MY BOOKINGS (User)
// ==========================================
export const getMyBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { page = 1, limit = 10, status, type } = req.query as any;

    const where: any = {
      userId: req.user.userId,
    };

    if (status) where.bookingStatus = status;
    if (type) {
      where.package = { type };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const total = await prisma.booking.count({ where });

   const bookings = await prisma.booking.findMany({
  where,
  skip,
  take,
  orderBy: { createdAt: 'desc' },
  include: {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  package: {
    select: {
      id: true,
      name: true,
      type: true,
      travelDate: true,
      returnDate: true,
      departureCity: true,
      posterUrl: true,
    },
  },
  travellersData: true,
  payments: { orderBy: { createdAt: 'desc' } },
},
});

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
          hasNext: skip + take < total,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error: any) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE BOOKING (User - own only)
// ==========================================
export const getBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        package: {
          include: {
            hotels: true,
            inclusions: true,
            itinerary: { orderBy: { order: 'asc' } },
          },
        },
        travellersData: true,
        payments: { orderBy: { createdAt: 'desc' } },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Check ownership (users can only see their own, admins can see all)
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message,
    });
  }
};

// ==========================================
// CANCEL BOOKING (User)
// ==========================================
export const cancelBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Check ownership
    if (booking.userId !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    // Can't cancel if already cancelled or completed
    if (booking.bookingStatus === 'CANCELLED') {
      res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
      return;
    }

    if (booking.bookingStatus === 'COMPLETED') {
      res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: 'CANCELLED',
        paymentStatus: 'REFUNDED',
      },
      include: {
        package: { select: { name: true, type: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking: updated, reason },
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL BOOKINGS (Admin)
// ==========================================
export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 20, status, type, search } = req.query as any;

    const where: any = {};

    if (status) where.bookingStatus = status;
    if (type) where.package = { type };

    if (search) {
      where.OR = [
        { bookingRef: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const total = await prisma.booking.count({ where });

    const bookings = await prisma.booking.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            type: true,
            travelDate: true,
            returnDate: true,
          },
        },
        travellersData: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
          hasNext: skip + take < total,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error: any) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE BOOKING STATUS (Admin)
// ==========================================
export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { bookingStatus: status },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        package: { select: { name: true, type: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: { booking: updated },
    });
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message,
    });
  }
};

// ==========================================
// BOOKING STATS (Admin)
// ==========================================
export const getBookingStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      total,
      pending,
      advancePaid,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
      totalAdvance,
      totalBalance,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { bookingStatus: 'PENDING_PAYMENT' } }),
      prisma.booking.count({ where: { bookingStatus: 'ADVANCE_PAID' } }),
      prisma.booking.count({ where: { bookingStatus: 'CONFIRMED' } }),
      prisma.booking.count({ where: { bookingStatus: 'COMPLETED' } }),
      prisma.booking.count({ where: { bookingStatus: 'CANCELLED' } }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { bookingStatus: { not: 'CANCELLED' } },
      }),
      prisma.booking.aggregate({
        _sum: { advancePaid: true },
        where: { bookingStatus: { not: 'CANCELLED' } },
      }),
      prisma.booking.aggregate({
        _sum: { balanceDue: true },
        where: { bookingStatus: { not: 'CANCELLED' } },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        advancePaid,
        confirmed,
        completed,
        cancelled,
        financials: {
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          totalAdvance: totalAdvance._sum.advancePaid || 0,
          totalBalance: totalBalance._sum.balanceDue || 0,
        },
      },
    });
  } catch (error: any) {
    console.error('Booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking stats',
      error: error.message,
    });
  }
};

// ==========================================
// DELETE BOOKING (User — only cancelled or pending)
// ==========================================
export const deleteBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Check ownership (admins can delete any)
    if (
      booking.userId !== req.user.userId &&
      req.user.role !== 'ADMIN'
    ) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    // Safety: Users can only delete CANCELLED or PENDING_PAYMENT bookings
    const allowedStatuses = ['CANCELLED', 'PENDING_PAYMENT'];
    if (
      req.user.role !== 'ADMIN' &&
      !allowedStatuses.includes(booking.bookingStatus)
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot delete a ${booking.bookingStatus.toLowerCase()} booking. Cancel it first, or contact support.`,
      });
      return;
    }

    // If there are successful payments, block deletion
    const hasPaidPayments = booking.payments.some(
      (p) => p.status === 'PAID'
    );
    if (hasPaidPayments && req.user.role !== 'ADMIN') {
      res.status(400).json({
        success: false,
        message:
          'Cannot delete a booking with completed payments. Please contact support for refund.',
      });
      return;
    }

    // Delete (cascade will remove travellers and payments via Prisma relations)
    await prisma.booking.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: error.message,
    });
  }
};