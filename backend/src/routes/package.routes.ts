import { Router } from 'express';
import {
  createPackage,
  listPackages,
  getPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  getPackageStats,
} from '../controllers/package.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  createPackageValidation,
  updatePackageValidation,
  listPackagesValidation,
  packageIdValidation,
} from '../utils/packageValidation';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// List all packages (with filters)
router.get('/', listPackagesValidation, validate, listPackages);

// Get single package
router.get('/:id', packageIdValidation, validate, getPackage);

// ==========================================
// ADMIN ROUTES (Protected)
// ==========================================

// Get stats
router.get(
  '/admin/stats',
  authMiddleware,
  adminMiddleware,
  getPackageStats
);

// Create package
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createPackageValidation,
  validate,
  createPackage
);

// Update package
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updatePackageValidation,
  validate,
  updatePackage
);

// Delete package
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  packageIdValidation,
  validate,
  deletePackage
);

// Toggle status
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  packageIdValidation,
  validate,
  togglePackageStatus
);

export default router;