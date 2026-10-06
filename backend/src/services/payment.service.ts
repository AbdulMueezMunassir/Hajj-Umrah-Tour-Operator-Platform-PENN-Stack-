import prisma from '../config/database';
import { generatePaymentHash, PAYHERE_CONFIG } from '../config/payhere';
import { createNotification } from './notification.service';

export const createPaymentRecord = async (
  bookingId: string,
  userId: string,
  amount: number,
  paymentType: 'ADVANCE' | 'BALANCE'
) => {
  return await prisma.payment.create({
    data: {
      bookingId,
      userId,
      amount,
      paymentType,
      gateway: 'PayHere',
      status: 'PENDING',
    },
  });
};

export const buildPayHereCheckout = (
  orderId: string,
  amount: number,
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  },
  itemName: string
) => {
  const hash = generatePaymentHash(orderId, amount, PAYHERE_CONFIG.currency);

  const checkoutData = {
    merchant_id: PAYHERE_CONFIG.merchantId,
    return_url: PAYHERE_CONFIG.returnUrl,
    cancel_url: PAYHERE_CONFIG.cancelUrl,
    notify_url: PAYHERE_CONFIG.notifyUrl,
    order_id: orderId,
    items: itemName,
    currency: PAYHERE_CONFIG.currency,
    amount: amount.toFixed(2),
    first_name: customerInfo.firstName,
    last_name: customerInfo.lastName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address,
    city: customerInfo.city,
    country: customerInfo.country || 'Sri Lanka',
    hash: hash,
  };

  return {
    checkoutUrl: PAYHERE_CONFIG.checkoutUrl,
    checkoutData,
  };
};

export const updateBookingAfterPayment = async (
  bookingId: string,
  paymentType: 'ADVANCE' | 'BALANCE',
  amount: number,
  transactionId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  let updateData: any = {};

  if (paymentType === 'ADVANCE') {
    updateData = {
      bookingStatus: 'ADVANCE_PAID',
      paymentStatus: 'PAID',
      advancePaid: amount,
      balanceDue: booking.totalAmount - amount,
    };
  } else if (paymentType === 'BALANCE') {
    updateData = {
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      advancePaid: booking.totalAmount,
      balanceDue: 0,
    };
  }

    const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: updateData,
    include: {
      package: { select: { name: true, type: true } },
      user: { select: { email: true, firstName: true, lastName: true } },
    },
  });

  await createNotification(
    booking.userId,
    'Payment Received',
    paymentType === 'ADVANCE'
      ? `Your advance payment for booking ${booking.bookingRef} was received. Your seats are reserved.`
      : `Your balance payment for booking ${booking.bookingRef} was received. Your booking is confirmed.`,
    'PAYMENT'
  );

  return updatedBooking;
};

export const generateOrderId = (
  bookingRef: string,
  paymentType: 'ADVANCE' | 'BALANCE'
): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = paymentType === 'ADVANCE' ? 'ADV' : 'BAL';
  return `${bookingRef}-${suffix}-${timestamp}`;
};