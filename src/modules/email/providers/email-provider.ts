import type { SendEmailParams, SendEmailResult } from "../types/email.types.js";

export interface EmailProvider {
  send(params: SendEmailParams): Promise<SendEmailResult>;
}
