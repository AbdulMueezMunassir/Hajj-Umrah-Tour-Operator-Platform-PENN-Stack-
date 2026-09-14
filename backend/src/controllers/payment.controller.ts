import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { verifyWebhookSignature } from '../config/payhere';
import {
  createPaymentRecord,
  buildPayHereCheckout,
  updateBookingAfterPayment,
  generateOrderId,
} from '../services/payment.service';

// ==========================================
// INITIATE PAYMENT (User)
// ==========================================
export const initiatePayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingId, paymentType } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        package: { select: { name: true, type: true } },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.userId !== req.user.userId) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (booking.bookingStatus === 'CANCELLED') {
      res
        .status(400)
        .json({ success: false, message: 'Cannot pay for a cancelled booking' });
      return;
    }

    if (booking.bookingStatus === 'COMPLETED') {
      res
        .status(400)
        .json({ success: false, message: 'Booking is already completed' });
      return;
    }

    let amount = 0;
    let itemName = '';

    if (paymentType === 'ADVANCE') {
      if (booking.bookingStatus !== 'PENDING_PAYMENT') {
        res.status(400).json({
          success: false,
          message: 'Advance already paid for this booking',
        });
        return;
      }
      amount = booking.advancePaid;
      itemName = `${booking.package.name} - 20% Advance Payment`;
    } else if (paymentType === 'BALANCE') {
      if (booking.bookingStatus === 'PENDING_PAYMENT') {
        res
          .status(400)
          .json({ success: false, message: 'Please pay the advance first' });
        return;
      }
      if (booking.balanceDue <= 0) {
        res.status(400).json({ success: false, message: 'No balance due' });
        return;
      }
      amount = booking.balanceDue;
      itemName = `${booking.package.name} - Remaining Balance`;
    }

    const orderId = generateOrderId(booking.bookingRef, paymentType);

    const payment = await createPaymentRecord(
      bookingId,
      req.user.userId,
      amount,
      paymentType
    );

    const { checkoutUrl, checkoutData } = buildPayHereCheckout(
      orderId,
      amount,
      {
        firstName: booking.user.firstName,
        lastName: booking.user.lastName,
        email: booking.user.email,
        phone: booking.user.phone || '0771234567',
        address: booking.user.address || 'Colombo',
        city: 'Colombo',
        country: 'Sri Lanka',
      },
      itemName
    );

    res.status(200).json({
      success: true,
      message: 'Payment session created',
      data: {
        paymentId: payment.id,
        orderId,
        amount,
        currency: 'LKR',
        paymentType,
        checkoutUrl,
        checkoutData,
      },
    });
  } catch (error: any) {
    console.error('Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message,
    });
  }
};

// ==========================================
// PAYHERE WEBHOOK (Notify URL)
// ==========================================
export const payhereNotify = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('📥 PayHere Webhook:', req.body);

    const {
      order_id,
      payment_id,
      payhere_amount,
      status_code,
    } = req.body;

    const isValid = verifyWebhookSignature(req.body);
    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      res.status(400).json({ success: false, message: 'Invalid signature' });
      return;
    }

    console.log('✅ Valid webhook signature');

    const bookingRefPattern = order_id.split('-').slice(0, 4).join('-');

    const booking = await prisma.booking.findFirst({
      where: { bookingRef: { startsWith: bookingRefPattern } },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const paymentType = order_id.includes('-ADV-') ? 'ADVANCE' : 'BALANCE';

    const payment = await prisma.payment.findFirst({
      where: {
        bookingId: booking.id,
        paymentType,
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    const statusCodeNum = parseInt(status_code);

    if (statusCodeNum === 2) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID', transactionId: payment_id },
      });

      await updateBookingAfterPayment(
        booking.id,
        paymentType as 'ADVANCE' | 'BALANCE',
        parseFloat(payhere_amount),
        payment_id
      );

      console.log(`✅ Payment confirmed: ${booking.bookingRef}`);
    } else if (statusCodeNum === -1 || statusCodeNum === -2) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', transactionId: payment_id },
      });
      console.log(`❌ Payment failed: ${booking.bookingRef}`);
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PROCESSING', transactionId: payment_id },
      });
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook failed',
      error: error.message,
    });
  }
};

// ==========================================
// VERIFY PAYMENT (User)
// ==========================================
export const verifyPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.totalAmount,
        advancePaid: booking.advancePaid,
        balanceDue: booking.balanceDue,
        payments: booking.payments,
      },
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

// ==========================================
// GET MY PAYMENTS (User)
// ==========================================
export const getMyPayments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { page = 1, limit = 10, status, type } = req.query as any;

    const where: any = { userId: req.user.userId };
    if (status) where.status = status;
    if (type) where.paymentType = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const total = await prisma.payment.count({ where });

    const payments = await prisma.payment.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          select: {
            id: true,
            bookingRef: true,
            totalAmount: true,
            bookingStatus: true,
            package: { select: { name: true, type: true } },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        payments,
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
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PAYMENT (User)
// ==========================================
export const getPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            package: { select: { name: true, type: true } },
            user: { select: { email: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    if (payment.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.status(200).json({ success: true, data: { payment } });
  } catch (error: any) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message,
    });
  }
};

// ==========================================
// MANUAL CONFIRM (Admin)
// ==========================================
export const manualConfirm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId, paymentType, transactionId } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const amount =
      paymentType === 'ADVANCE' ? booking.advancePaid : booking.balanceDue;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: booking.userId,
        amount,
        paymentType,
        gateway: 'Manual',
        status: 'PAID',
        transactionId: transactionId || `MANUAL-${Date.now()}`,
      },
    });

    await updateBookingAfterPayment(
      bookingId,
      paymentType,
      amount,
      payment.transactionId || 'MANUAL'
    );

    res.status(200).json({
      success: true,
      message: `Payment manually confirmed (${paymentType})`,
      data: { payment },
    });
  } catch (error: any) {
    console.error('Manual confirm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message,
    });
  }
};

// ==========================================
// PAYMENT STATS (Admin)
// ==========================================
export const getPaymentStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      total,
      paid,
      pending,
      failed,
      refunded,
      totalPaid,
      advanceCount,
      balanceCount,
    ] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: 'PAID' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'FAILED' } }),
      prisma.payment.count({ where: { status: 'REFUNDED' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
      prisma.payment.count({ where: { paymentType: 'ADVANCE', status: 'PAID' } }),
      prisma.payment.count({ where: { paymentType: 'BALANCE', status: 'PAID' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        paid,
        pending,
        failed,
        refunded,
        advanceCount,
        balanceCount,
        totalCollected: totalPaid._sum.amount || 0,
      },
    });
  } catch (error: any) {
    console.error('Payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment stats',
      error: error.message,
    });
  }
};