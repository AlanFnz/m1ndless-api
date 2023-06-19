import { NextFunction, Request, Response } from 'express';
import { errorHandler } from './error-handler';

export async function handleError(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!errorHandler.isTrustedError(error)) {
    next(error);
    return;
  }
  await errorHandler.handleError(error, req, res, next);
}
