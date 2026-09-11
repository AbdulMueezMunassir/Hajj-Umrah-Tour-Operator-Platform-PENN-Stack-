import { body, query, param } from 'express-validator';

// ==========================================
// CREATE PACKAGE VALIDATION
// ==========================================
export const createPackageValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Package name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Package name must be 3-200 characters'),

  body('type')
    .isIn(['HAJJ', 'UMRAH'])
    .withMessage('Type must be HAJJ or UMRAH'),

  body('departureCity')
    .trim()
    .notEmpty()
    .withMessage('Departure city is required'),

  body('travelDate')
    .isISO8601()
    .withMessage('Travel date must be a valid date'),

  body('returnDate')
    .isISO8601()
    .withMessage('Return date must be a valid date'),

  body('duration')
    .isInt({ min: 1, max: 90 })
    .withMessage('Duration must be between 1 and 90 days'),

  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),

  body('advancePercent')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Advance percent must be 1-100'),

  body('availableSeats')
    .isInt({ min: 1, max: 500 })
    .withMessage('Available seats must be 1-500'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('posterUrl')
    .optional()
    .isString(),

  // Hotels validation
  body('hotels')
    .optional()
    .isArray()
    .withMessage('Hotels must be an array'),

  body('hotels.*.city')
    .optional()
    .isIn(['MAKKAH', 'MADINAH'])
    .withMessage('Hotel city must be MAKKAH or MADINAH'),

  body('hotels.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Hotel name is required'),

  // Itinerary validation
  body('itinerary')
    .optional()
    .isArray(),

  body('itinerary.*.day')
    .optional()
    .isInt({ min: 1 }),

  body('itinerary.*.title')
    .optional()
    .trim()
    .notEmpty(),

  // Inclusions
  body('inclusions')
    .optional()
    .isArray(),
];

// ==========================================
// UPDATE PACKAGE VALIDATION
// ==========================================
export const updatePackageValidation = [
  body('name').optional().trim().isLength({ min: 3, max: 200 }),
  body('type').optional().isIn(['HAJJ', 'UMRAH']),
  body('departureCity').optional().trim().notEmpty(),
  body('travelDate').optional().isISO8601(),
  body('returnDate').optional().isISO8601(),
  body('duration').optional().isInt({ min: 1, max: 90 }),
  body('totalPrice').optional().isFloat({ min: 0 }),
  body('advancePercent').optional().isInt({ min: 1, max: 100 }),
  body('availableSeats').optional().isInt({ min: 0, max: 500 }),
  body('description').optional().trim().notEmpty(),
];

// ==========================================
// QUERY FILTERS VALIDATION
// ==========================================
export const listPackagesValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('type').optional().isIn(['HAJJ', 'UMRAH']),
  query('status').optional().isIn(['ACTIVE', 'INACTIVE']),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('search').optional().trim(),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'totalPrice', 'travelDate', 'name']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

// ==========================================
// ID PARAM VALIDATION
// ==========================================
export const packageIdValidation = [
  param('id').notEmpty().withMessage('Package ID is required'),
];