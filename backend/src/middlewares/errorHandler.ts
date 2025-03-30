import { ErrorRequestHandler } from 'express';
import { Response, Request } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import mongoose from 'mongoose';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: CustomError | mongoose.Error.ValidationError,
  req: Request,
  res: Response,
) => {
  // Check if the error is a Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: ReasonPhrases.BAD_REQUEST,
      errors: Object.values(err.errors).map((error) => error.message),
    });
    res.end();
    return;
  }

  // Handle other types of errors
  const statusCode = (err as CustomError).statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message ?? ReasonPhrases.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
  res.end();
  return;
};
