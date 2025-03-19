import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import mongoose from 'mongoose';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Check if the error is a mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
     res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
      errors: err.errors,
    });
    return;
  }

  // Handle other types of errors
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR; // Default to 500 if no specific status code is set
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR; // Fallback to default message

   res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
  return;
};
