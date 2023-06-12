import { Request, Response } from 'express';
import { errorHandler } from './errorHandler';

export async function handleError(
  error: any,
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  if (!errorHandler.isTrustedError(error)) {
    next(error);
    return;
  }
  await errorHandler.handleError(error);
}
