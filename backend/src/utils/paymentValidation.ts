import { body, param, query } from 'express-validator';

export const initiatePaymentValidation = [
  body('bookingId').notEmpty().withMessage('Booking ID is required').isString(),
  body('paymentType')
    .isIn(['ADVANCE', 'BALANCE'])
    .withMessage('Payment type must be ADVANCE or BALANCE'),
];

export const manualConfirmValidation = [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
  body('paymentType')
    .isIn(['ADVANCE', 'BALANCE'])
    .withMessage('Payment type must be ADVANCE or BALANCE'),
  body('transactionId').optional().trim(),
];

export const listPaymentsValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status')
    .optional()
    .isIn(['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED']),
  query('type').optional().isIn(['ADVANCE', 'BALANCE']),
];

export const paymentIdValidation = [
  param('id').notEmpty().withMessage('Payment ID is required'),
];

export const bookingIdValidation = [
  param('bookingId').notEmpty().withMessage('Booking ID is required'),
];