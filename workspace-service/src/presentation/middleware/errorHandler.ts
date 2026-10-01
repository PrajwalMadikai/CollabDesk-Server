import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
  });
}
