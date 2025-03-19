import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: 'Validation Error',
        errors: result.error.format(),
      });
      return;
    }

    next();
  };
};
