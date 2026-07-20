import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["RESEND_API_KEY", "RESEND_FROM", "MAIL_TO"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${envVar}`);
  }
}

const rawCorsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const corsOrigins = rawCorsOrigin.split(",").map((origin) => origin.trim());

export const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  RESEND_FROM: process.env.RESEND_FROM!,
  MAIL_TO: process.env.MAIL_TO!,
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  CORS_ORIGINS: corsOrigins,
};
