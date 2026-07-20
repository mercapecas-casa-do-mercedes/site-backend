export interface EmailInput {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export interface SendEmailParams {
  subject: string;
  content: string;
  replyTo: string;
}

export interface SendEmailResult {
  id: string;
}
