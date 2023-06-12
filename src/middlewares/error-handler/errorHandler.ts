import bunyan from 'bunyan';
import { logger } from '../logger';
import { BaseError } from './baseError';

class ErrorHandler {
  logger: bunyan;

  constructor(logger: bunyan) {
    this.logger = logger;
  }

  public async handleError(err: Error): Promise<void> {
    logger.error(err);
  }

  public isTrustedError(error: Error) {
    return error instanceof BaseError && error.isOperational;
  }
}

export const errorHandler = new ErrorHandler(logger);
