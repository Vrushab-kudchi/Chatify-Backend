export const errorMiddleware = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export const TryCatch = (program) => async (req, res, next) => {
  try {
    await program(req, res, next);
  } catch (error) {
    next(error);
  }
};
