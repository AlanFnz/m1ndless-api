import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../constants';

export function handleError(
  error: any,
  req: Request,
  res: Response,
  next: Function
): void {
  res
    .status(error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    .send({ message: error.message });
}
