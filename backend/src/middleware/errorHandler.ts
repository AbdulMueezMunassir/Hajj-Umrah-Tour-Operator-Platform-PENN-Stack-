import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err.message);

  if (err.code === 'P2002') {
    res.status(400).json({
      success: false,
      message: 'A record with this value already exists.',
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
};