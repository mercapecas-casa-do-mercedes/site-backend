import { describe, it, expect, vi } from "vitest";
import { EmailService } from "./services/email.service.js";
import type { EmailProvider } from "./providers/email-provider.js";
import type { SendEmailParams, SendEmailResult } from "./types/email.types.js";
import { ProviderError } from "../../shared/errors/app-errors.js";

const makeMockProvider = (
  impl?: (params: SendEmailParams) => Promise<SendEmailResult>
): EmailProvider => ({
  send: impl ?? vi.fn().mockResolvedValue({ id: "test-id-123" }),
});

describe("EmailService", () => {
  const input = {
    fullName: "João Silva",
    email: "joao@example.com",
    phone: "+55 11 99999-9999",
    message: "Gostaria de mais informações.",
  };

  it("deve chamar o provider com o assunto correto", async () => {
    const sendMock = vi.fn().mockResolvedValue({ id: "abc" });
    const provider = { send: sendMock };
    const service = new EmailService(provider);

    await service.send(input);

    expect(sendMock).toHaveBeenCalledOnce();
    const params: SendEmailParams = sendMock.mock.calls[0]![0];
    expect(params.subject).toContain("João Silva");
    expect(params.subject).toContain("Novo Contato");
  });

  it("deve definir o replyTo como o e-mail do contato", async () => {
    const sendMock = vi.fn().mockResolvedValue({ id: "abc" });
    const provider = { send: sendMock };
    const service = new EmailService(provider);

    await service.send(input);

    const params: SendEmailParams = sendMock.mock.calls[0]![0];
    expect(params.replyTo).toBe("joao@example.com");
  });

  it("deve incluir nome, e-mail, telefone e mensagem no corpo do e-mail", async () => {
    const sendMock = vi.fn().mockResolvedValue({ id: "abc" });
    const provider = { send: sendMock };
    const service = new EmailService(provider);

    await service.send(input);

    const params: SendEmailParams = sendMock.mock.calls[0]![0];
    expect(params.content).toContain("João Silva");
    expect(params.content).toContain("joao@example.com");
    expect(params.content).toContain("+55 11 99999-9999");
    expect(params.content).toContain("Gostaria de mais informações.");
  });

  it("deve retornar o ID retornado pelo provider em caso de sucesso", async () => {
    const provider = makeMockProvider();
    const service = new EmailService(provider);

    const result = await service.send(input);

    expect(result.id).toBe("test-id-123");
  });

  it("deve propagar o ProviderError gerado pelo provider", async () => {
    const provider = makeMockProvider(() => {
      throw new ProviderError("Falha de conexão com o provedor.");
    });
    const service = new EmailService(provider);

    await expect(service.send(input)).rejects.toThrow(ProviderError);
    await expect(service.send(input)).rejects.toThrow(
      "Falha de conexão com o provedor."
    );
  });
});
