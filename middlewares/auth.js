import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return next(new ErrorHandler("UnAuthorized User Please Login", 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
