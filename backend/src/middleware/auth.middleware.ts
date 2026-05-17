import { Request, Response, NextFunction } from 'express';
import { verifyToken as verifyJWT } from '../utils/jwt.utils';
import { AppError } from '../types';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: import('../types').JWTPayload;
    }
  }
}

export const verifyToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided. Authorization denied.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new AppError('Token expired. Please login again.', 401));
    }
    if (error instanceof JsonWebTokenError) {
      return next(new AppError('Invalid token. Authorization denied.', 401));
    }
    next(error);
  }
};
