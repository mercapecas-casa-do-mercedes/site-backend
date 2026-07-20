import type { Request, Response, NextFunction } from "express";

export function validate(schema: (data: unknown) => unknown) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
