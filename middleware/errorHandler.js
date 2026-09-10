const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';

  if (err.name === 'ValidationError') {
    status = 400; errorCode = 'VALIDATION_ERROR'; message = Object.values(err.errors).map((item) => item.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400; errorCode = 'INVALID_ID'; message = 'Invalid resource id';
  } else if (err.code === 11000) {
    status = 409; errorCode = 'DUPLICATE_RESOURCE'; message = 'A resource with that unique value already exists';
  }

  res.status(status).json({ success: false, message, errorCode });
};

module.exports = errorHandler;
