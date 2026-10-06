import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// Public - max 5 messages per IP per 15 minutes
router.post('/', rateLimit(5, 15 * 60 * 1000), submitContact);

export default router;