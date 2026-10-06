import { Request, Response, NextFunction } from 'express';

interface Hit {
  count: number;
  resetAt: number;
}

const hits = new Map<string, Hit>();

/**
 * Very small in-memory rate limiter for public endpoints
 * (contact form, forgot password). Limits per IP + route.
 */
export const rateLimit =
  (max: number, windowMs: number) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (entry.count >= max) {
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
      });
      return;
    }

    entry.count += 1;
    next();
  };