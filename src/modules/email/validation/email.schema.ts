import { ValidationError } from "../../../shared/errors/app-errors.js";
import type { EmailInput } from "../types/email.types.js";

export function emailSchema(data: unknown): EmailInput {
  if (!data || typeof data !== "object") {
    throw new ValidationError("O corpo da requisição deve ser um objeto válido.");
  }

  const payload = data as Record<string, unknown>;

  const rawFullName = payload.fullName;
  const rawEmail = payload.email;
  const rawPhone = payload.phone;
  const rawMessage = payload.message;

  if (rawFullName === undefined || rawFullName === null) {
    throw new ValidationError("O campo 'fullName' é obrigatório.");
  }
  if (rawEmail === undefined || rawEmail === null) {
    throw new ValidationError("O campo 'email' é obrigatório.");
  }
  if (rawPhone === undefined || rawPhone === null) {
    throw new ValidationError("O campo 'phone' é obrigatório.");
  }
  if (rawMessage === undefined || rawMessage === null) {
    throw new ValidationError("O campo 'message' é obrigatório.");
  }

  if (typeof rawFullName !== "string") {
    throw new ValidationError("O campo 'fullName' deve ser uma string.");
  }
  if (typeof rawEmail !== "string") {
    throw new ValidationError("O campo 'email' deve ser uma string.");
  }
  if (typeof rawPhone !== "string") {
    throw new ValidationError("O campo 'phone' deve ser uma string.");
  }
  if (typeof rawMessage !== "string") {
    throw new ValidationError("O campo 'message' deve ser uma string.");
  }

  const fullName = rawFullName.trim();
  const email = rawEmail.trim();
  const phone = rawPhone.trim();
  const message = rawMessage.trim();

  if (fullName.length === 0) {
    throw new ValidationError("O campo 'fullName' não pode ser vazio.");
  }

  if (email.length === 0) {
    throw new ValidationError("O campo 'email' não pode ser vazio.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("O campo 'email' deve ser um e-mail válido.");
  }

  if (phone.length === 0) {
    throw new ValidationError("O campo 'phone' não pode ser vazio.");
  }

  const phoneRegex = /^[0-9\s()+-]+$/;
  if (!phoneRegex.test(phone)) {
    throw new ValidationError("O campo 'phone' contém caracteres inválidos.");
  }

  if (message.length === 0) {
    throw new ValidationError("O campo 'message' não pode ser vazio.");
  }

  return {
    fullName,
    email,
    phone,
    message,
  };
}
