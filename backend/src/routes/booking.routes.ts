import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  deleteBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
} from '../controllers/booking.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  createBookingValidation,
  listBookingsValidation,
  updateStatusValidation,
  cancelBookingValidation,
  bookingIdValidation,
} from '../utils/bookingValidation';

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

// ==========================================
// USER ROUTES
// ==========================================

// Create booking
router.post('/', createBookingValidation, validate, createBooking);

// Get my bookings
router.get('/', listBookingsValidation, validate, getMyBookings);

// Get single booking
router.get('/:id', bookingIdValidation, validate, getBooking);

// Cancel booking
router.put(
  '/:id/cancel',
  cancelBookingValidation,
  validate,
  cancelBooking
);

// Delete booking (only cancelled or pending-payment)
router.delete(
  '/:id',
  bookingIdValidation,
  validate,
  deleteBooking
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all bookings
router.get(
  '/admin/all',
  adminMiddleware,
  listBookingsValidation,
  validate,
  getAllBookings
);

// Get booking stats
router.get('/admin/stats', adminMiddleware, getBookingStats);

// Update booking status
router.put(
  '/admin/:id/status',
  adminMiddleware,
  updateStatusValidation,
  validate,
  updateBookingStatus
);

export default router;