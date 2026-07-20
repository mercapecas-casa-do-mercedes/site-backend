import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ValidationError, ProviderError } from "../errors/app-errors.js";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof ProviderError) {
    res.status(502).json({ error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "Erro interno no servidor.";
  res.status(500).json({ error: message });
};
