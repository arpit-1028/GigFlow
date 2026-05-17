import { Request, Response, NextFunction } from 'express';
import { UserRole, AppError } from '../types';

/**
 * Role-based access control middleware factory.
 * Usage: router.delete('/:id', verifyToken, requireRole('admin'), controller)
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(' or ')}.`,
          403
        )
      );
    }

    next();
  };
};
