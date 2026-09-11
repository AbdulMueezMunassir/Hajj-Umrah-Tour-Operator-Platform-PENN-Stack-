import { body, param, query } from 'express-validator';

// ==========================================
// CREATE BOOKING VALIDATION
// ==========================================
export const createBookingValidation = [
  body('packageId')
    .notEmpty()
    .withMessage('Package ID is required')
    .isString(),

  body('travellers')
    .isArray({ min: 1 })
    .withMessage('At least one traveller is required'),

  body('travellers.*.fullName')
    .trim()
    .notEmpty()
    .withMessage('Traveller full name is required'),

  body('travellers.*.passportNumber')
    .trim()
    .notEmpty()
    .withMessage('Passport number is required'),

  body('travellers.*.dateOfBirth')
    .isISO8601()
    .withMessage('Valid date of birth is required'),

  body('travellers.*.gender')
    .isIn(['Male', 'Female', 'MALE', 'FEMALE'])
    .withMessage('Gender must be Male or Female'),

  body('travellers.*.relationship')
    .optional()
    .trim(),

  body('travellers.*.nic')
    .optional()
    .trim(),

  body('travellers.*.phone')
    .optional()
    .trim(),
];

// ==========================================
// LIST BOOKINGS VALIDATION
// ==========================================
export const listBookingsValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status')
    .optional()
    .isIn([
      'PENDING_PAYMENT',
      'ADVANCE_PAID',
      'CONFIRMED',
      'DOCUMENTS_PENDING',
      'DOCUMENTS_VERIFIED',
      'TRAVEL_READY',
      'COMPLETED',
      'CANCELLED',
    ]),
  query('type').optional().isIn(['HAJJ', 'UMRAH']),
];

// ==========================================
// UPDATE STATUS VALIDATION
// ==========================================
export const updateStatusValidation = [
  param('id').notEmpty().withMessage('Booking ID is required'),
  body('status')
    .isIn([
      'PENDING_PAYMENT',
      'ADVANCE_PAID',
      'CONFIRMED',
      'DOCUMENTS_PENDING',
      'DOCUMENTS_VERIFIED',
      'TRAVEL_READY',
      'COMPLETED',
      'CANCELLED',
    ])
    .withMessage('Invalid booking status'),
];

// ==========================================
// CANCEL BOOKING VALIDATION
// ==========================================
export const cancelBookingValidation = [
  param('id').notEmpty().withMessage('Booking ID is required'),
  body('reason').optional().trim(),
];

// ==========================================
// ID PARAM VALIDATION
// ==========================================
export const bookingIdValidation = [
  param('id').notEmpty().withMessage('Booking ID is required'),
];