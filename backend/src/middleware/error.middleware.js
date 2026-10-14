function errorMiddleware(err, req, res, next) {
  console.error('API Error:', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
    type: err.type
  });

  if (res.headersSent) {
    return next(err);
  }

  // Malformed JSON from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON request body'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message
    });
  }

  if (err.message === 'Invalid or expired refresh token') {
    return res.status(401).json({
      message: err.message
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Email already exists'
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: 'Something went wrong!'
  });

}

module.exports = errorMiddleware;