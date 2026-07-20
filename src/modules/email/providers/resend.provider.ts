import { Resend } from "resend";
import { env } from "../../../config/env.js";
import { ProviderError } from "../../../shared/errors/app-errors.js";
import type { SendEmailParams, SendEmailResult } from "../types/email.types.js";
import type { EmailProvider } from "./email-provider.js";

export class ResendProvider implements EmailProvider {
  private resend: Resend;
  private from: string;
  private to: string;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.from = env.RESEND_FROM;
    this.to = env.MAIL_TO;
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: [this.to],
        replyTo: params.replyTo,
        subject: params.subject,
        text: params.content,
      });

      if (error) {
        throw new ProviderError(error.message);
      }

      if (!data || !data.id) {
        throw new ProviderError("Resposta inválida do provedor Resend.");
      }

      return { id: data.id };
    } catch (err: unknown) {
      if (err instanceof ProviderError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : String(err);
      throw new ProviderError(message);
    }
  }
}
