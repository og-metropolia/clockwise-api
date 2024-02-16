import { NextFunction, Request, Response } from 'express';
import CustomError from './classes/CustomError';
import { ErrorResponse } from './types/MessageTypes';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
) => {
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { notFound, errorHandler };
