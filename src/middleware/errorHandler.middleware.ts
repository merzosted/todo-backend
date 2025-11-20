import { Request, Response, NextFunction } from "express";
import { ErrorLog } from "../models/errorLog.js";
import { AuthRequest } from "./auth.middleware.js";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  // Log error to MongoDB
  try {
    await ErrorLog.create({
      message,
      stack: err.stack,
      statusCode,
      method: req.method,
      url: req.originalUrl,
      userId: (req as AuthRequest).user?.id,
    });
  } catch (logError) {
    console.error("Failed to log error to database:", logError);
  }

  // Log to console
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
