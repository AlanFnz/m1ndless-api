import bunyan, { LogLevel } from 'bunyan';

export const logger = bunyan.createLogger({
  name: 'mainLogger',
  streams: [
    {
      stream: process.stdout,
      level: (process.env.LOG_LEVEL || 'info') as LogLevel,
    },
  ],
});

logger.info('mainLogger logger started');
