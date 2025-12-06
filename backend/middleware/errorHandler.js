// Centralized Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  // MongoDB errors
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(503).json({
      success: false,
      message: "Database service temporarily unavailable. Please try again.",
      error:
        process.env.NODE_ENV === "production"
          ? "Database error"
          : err.message,
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token. Please login again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size too large. Maximum 10MB allowed.",
    });
  }

  // RunwayML API errors
  if (err.response && err.response.status === 402) {
    return res.status(402).json({
      success: false,
      message: "Video generation service quota exceeded. Please contact support.",
    });
  }

  if (err.response && err.response.status === 429) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please wait a moment and try again.",
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

// Not Found Handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFoundHandler };
