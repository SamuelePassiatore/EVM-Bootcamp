import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.siwe) {
    next();
  }
  res.status(401).json({ message: "unauthorized" });
};
