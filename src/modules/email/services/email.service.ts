import type { EmailInput, SendEmailResult } from "../types/email.types.js";
import type { EmailProvider } from "../providers/email-provider.js";

export class EmailService {
  constructor(private emailProvider: EmailProvider) {}

  async send(input: EmailInput): Promise<SendEmailResult> {
    const subject = `Novo Contato - MercaPeças (${input.fullName})`;
    const content = `Nome: ${input.fullName}
E-mail: ${input.email}
Telefone: ${input.phone}
Mensagem: ${input.message}`;

    return this.emailProvider.send({
      subject,
      content,
      replyTo: input.email,
    });
  }
}
