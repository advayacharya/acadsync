const logger = require('../utils/logger');
const { AppError } = require('../errors/customErrors');

const errorHandler = (err, req, res, next) => {
  logger.error({ err, url: req.originalUrl, method: req.method }, 'Unhandled request error');

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {})
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

module.exports = errorHandler;
