import { Request, Response, NextFunction } from 'express';
import { Role, ROLE_HIERARCHY } from '../types/enums';
import { AppError } from './errorHandler';

/**
 * Role-based authorization middleware factory.
 * Pass one or more roles that are allowed to access the route.
 * SUPER_ADMIN implicitly passes all checks.
 *
 * @example
 * router.patch('/approve', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), controller)
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const userRoleIndex = ROLE_HIERARCHY.indexOf(req.user.role as Role);
    const minAllowedIndex = Math.min(
      ...allowedRoles.map((r) => ROLE_HIERARCHY.indexOf(r))
    );

    // SUPER_ADMIN always passes
    if (req.user.role === Role.SUPER_ADMIN) {
      return next();
    }

    if (userRoleIndex < minAllowedIndex) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };

/**
 * Shorthand guards for common role checks.
 */
export const requireAdmin = authorize(Role.ADMIN, Role.SUPER_ADMIN);
export const requireMember = authorize(Role.MEMBER, Role.EXECUTIVE, Role.CHAPTER_ADMIN, Role.ADMIN, Role.SUPER_ADMIN);
export const requireChapterAdmin = authorize(Role.CHAPTER_ADMIN, Role.ADMIN, Role.SUPER_ADMIN);
export const requireSuperAdmin = authorize(Role.SUPER_ADMIN);
