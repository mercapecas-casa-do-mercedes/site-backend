import type { Request, Response, NextFunction } from "express";
import type { EmailService } from "../services/email.service.js";

export class EmailController {
  constructor(private emailService: EmailService) { }

  send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.emailService.send(req.body);
      res.status(201).json({ id: result.id });
    } catch (error) {
      next(error);
    }
  };
}
