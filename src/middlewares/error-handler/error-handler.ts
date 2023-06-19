import bunyan from 'bunyan';
import { NextFunction, Request, Response } from 'express';
import { APIError } from './api-error';
import { BaseError } from './base-error';
import { logger } from '../logger';

class ErrorHandler {
  logger: bunyan;

  constructor(logger: bunyan) {
    this.logger = logger;
  }

  public async handleError(
    error: Error,
    req?: Request,
    res?: Response,
    next?: NextFunction
  ): Promise<void> {
    if (this.isTrustedError(error)) {
      const apiError = error as APIError;
      this.logger.error(apiError);

      res.status(apiError.httpCode || 500).json({
        message: apiError.message,
        endpoint: apiError.methodName,
      });
    } else {
      this.logger.error(error);

      res.status(500).json({
        message: 'An unexpected error occurred.',
      });
    }
  }

  public isTrustedError(error: Error): boolean {
    return error instanceof BaseError && error.isOperational;
  }
}

export const errorHandler = new ErrorHandler(logger);
