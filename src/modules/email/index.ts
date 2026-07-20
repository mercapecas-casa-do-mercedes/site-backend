import { ResendProvider } from "./providers/resend.provider.js";
import { EmailService } from "./services/email.service.js";
import { EmailController } from "./controllers/email.controller.js";
import { createEmailRouter } from "./routes/email.routes.js";

const emailProvider = new ResendProvider();
const emailService = new EmailService(emailProvider);
const emailController = new EmailController(emailService);
const emailRouter = createEmailRouter(emailController);

export default emailRouter;
