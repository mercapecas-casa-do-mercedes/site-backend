import { Router } from "express";
import { EmailController } from "../controllers/email.controller.js";
import { validate } from "../../../shared/middlewares/validate.js";
import { emailSchema } from "../validation/email.schema.js";

export function createEmailRouter(controller: EmailController): Router {
  const router = Router();

  router.post("/", validate(emailSchema), controller.send);

  return router;
}
