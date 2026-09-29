import { Router } from 'express';
import {
  initiatePayment,
  payhereNotify,
  verifyPayment,
  getMyPayments,
  getPayment,
  manualConfirm,
  getPaymentStats,
  getAllPayments,  // ← Add this
} from '../controllers/payment.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  initiatePaymentValidation,
  manualConfirmValidation,
  listPaymentsValidation,
  paymentIdValidation,
  bookingIdValidation,
} from '../utils/paymentValidation';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.post('/notify', payhereNotify);

// ==========================================
// USER ROUTES (Protected)
// ==========================================
router.post(
  '/initiate',
  authMiddleware,
  initiatePaymentValidation,
  validate,
  initiatePayment
);

router.get('/', authMiddleware, listPaymentsValidation, validate, getMyPayments);

router.get(
  '/verify/:bookingId',
  authMiddleware,
  bookingIdValidation,
  validate,
  verifyPayment
);

// ==========================================
// ADMIN ROUTES
// ==========================================
// Get all payments (admin)
router.get(
  '/admin/all',
  authMiddleware,
  adminMiddleware,
  getAllPayments
);

router.get('/admin/stats', authMiddleware, adminMiddleware, getPaymentStats);

router.post(
  '/manual-confirm',
  authMiddleware,
  adminMiddleware,
  manualConfirmValidation,
  validate,
  manualConfirm
);

// ==========================================
// MUST BE LAST (dynamic route)
// ==========================================
router.get('/:id', authMiddleware, paymentIdValidation, validate, getPayment);

export default router;