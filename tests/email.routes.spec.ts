import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { EmailService } from "../src/modules/email/services/email.service.js";
import { ProviderError } from "../src/shared/errors/app-errors.js";

const sendSpy = vi.spyOn(EmailService.prototype, "send");

const validPayload = {
  fullName: "Maria Souza",
  email: "maria@example.com",
  phone: "+55 21 98888-7777",
  message: "Preciso de um orçamento.",
};

describe("CORS para /email", () => {
  beforeEach(() => {
    sendSpy.mockReset();
  });

  it("deve responder com sucesso ao preflight OPTIONS de origem permitida", async () => {
    const res = await request(app)
      .options("/email")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "Content-Type");

    expect(res.status).toBe(204);
    expect(res.header["access-control-allow-origin"]).toBe("http://localhost:5173");
    expect(res.header["access-control-allow-methods"]).toContain("POST");
    expect(res.header["access-control-allow-headers"]).toContain("Content-Type");
  });

  it("deve incluir header CORS em POST de origem permitida", async () => {
    sendSpy.mockResolvedValue({ id: "resend-id-xyz" });
    const res = await request(app)
      .post("/email")
      .set("Origin", "http://localhost:5173")
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.header["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("não deve incluir header CORS para origem não configurada", async () => {
    sendSpy.mockResolvedValue({ id: "resend-id-xyz" });
    const res = await request(app)
      .post("/email")
      .set("Origin", "http://unauthorized.com")
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.header["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("POST /email", () => {
  beforeEach(() => {
    sendSpy.mockReset();
  });

  it("deve retornar 201 e o id ao receber um payload válido", async () => {
    sendSpy.mockResolvedValue({ id: "resend-id-xyz" });
    const res = await request(app)
      .post("/email")
      .send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: "resend-id-xyz" });
  });

  it("deve retornar 400 quando fullName estiver ausente", async () => {
    sendSpy.mockResolvedValue({ id: "irrelevant" });
    const { fullName: _, ...withoutFullName } = validPayload;
    const res = await request(app).post("/email").send(withoutFullName);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 quando email estiver ausente", async () => {
    sendSpy.mockResolvedValue({ id: "irrelevant" });
    const { email: _, ...withoutEmail } = validPayload;
    const res = await request(app).post("/email").send(withoutEmail);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 quando phone estiver ausente", async () => {
    sendSpy.mockResolvedValue({ id: "irrelevant" });
    const { phone: _, ...withoutPhone } = validPayload;
    const res = await request(app).post("/email").send(withoutPhone);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 quando message estiver ausente", async () => {
    sendSpy.mockResolvedValue({ id: "irrelevant" });
    const { message: _, ...withoutMessage } = validPayload;
    const res = await request(app).post("/email").send(withoutMessage);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 quando o email for inválido", async () => {
    sendSpy.mockResolvedValue({ id: "irrelevant" });
    const res = await request(app)
      .post("/email")
      .send({ ...validPayload, email: "email-invalido" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 400 quando o corpo da requisição estiver completamente vazio", async () => {
    sendSpy.mockResolvedValue({ id: "irrelevant" });
    const res = await request(app).post("/email").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve retornar 502 quando o provider lançar um ProviderError", async () => {
    sendSpy.mockRejectedValue(new ProviderError("Timeout na API do Resend."));
    const res = await request(app).post("/email").send(validPayload);
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty("error");
  });
});
