import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error]:', err.message || err);

  res.status(500).json({
    reply: "I'm sorry, I encountered an internal server error while trying to process your request.",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
};
