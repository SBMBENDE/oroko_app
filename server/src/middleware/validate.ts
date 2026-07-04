import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Validates req.body, req.query, and req.params against a Zod schema.
 * On failure, passes the ZodError to errorHandler via next().
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
