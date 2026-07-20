import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import { EmailService } from "../src/modules/email/services/email.service.js";
import { EmailController } from "../src/modules/email/controllers/email.controller.js";
import { createEmailRouter } from "../src/modules/email/routes/email.routes.js";
import { errorHandler } from "../src/shared/middlewares/error-handler.js";
import { ProviderError } from "../src/shared/errors/app-errors.js";
const buildApp = (sendImpl) => {
    const mockProvider = { send: vi.fn().mockImplementation(sendImpl) };
    const service = new EmailService(mockProvider);
    const controller = new EmailController(service);
    const router = createEmailRouter(controller);
    const app = express();
    app.use(express.json());
    app.use("/email", router);
    app.use(errorHandler);
    return app;
};
const validPayload = {
    fullName: "Maria Souza",
    email: "maria@example.com",
    phone: "+55 21 98888-7777",
    message: "Preciso de um orçamento.",
};
describe("POST /email", () => {
    it("deve retornar 201 e o id ao receber um payload válido", async () => {
        const app = buildApp(async () => ({ id: "resend-id-xyz" }));
        const res = await request(app).post("/email").send(validPayload);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ id: "resend-id-xyz" });
    });
    it("deve retornar 400 quando fullName estiver ausente", async () => {
        const app = buildApp(async () => ({ id: "irrelevant" }));
        const { fullName: _, ...withoutFullName } = validPayload;
        const res = await request(app).post("/email").send(withoutFullName);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("deve retornar 400 quando email estiver ausente", async () => {
        const app = buildApp(async () => ({ id: "irrelevant" }));
        const { email: _, ...withoutEmail } = validPayload;
        const res = await request(app).post("/email").send(withoutEmail);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("deve retornar 400 quando phone estiver ausente", async () => {
        const app = buildApp(async () => ({ id: "irrelevant" }));
        const { phone: _, ...withoutPhone } = validPayload;
        const res = await request(app).post("/email").send(withoutPhone);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("deve retornar 400 quando message estiver ausente", async () => {
        const app = buildApp(async () => ({ id: "irrelevant" }));
        const { message: _, ...withoutMessage } = validPayload;
        const res = await request(app).post("/email").send(withoutMessage);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("deve retornar 400 quando o email for inválido", async () => {
        const app = buildApp(async () => ({ id: "irrelevant" }));
        const res = await request(app)
            .post("/email")
            .send({ ...validPayload, email: "email-invalido" });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("deve retornar 400 quando o corpo da requisição estiver completamente vazio", async () => {
        const app = buildApp(async () => ({ id: "irrelevant" }));
        const res = await request(app).post("/email").send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("deve retornar 502 quando o provider lançar um ProviderError", async () => {
        const app = buildApp(async () => {
            throw new ProviderError("Timeout na API do Resend.");
        });
        const res = await request(app).post("/email").send(validPayload);
        expect(res.status).toBe(502);
        expect(res.body).toHaveProperty("error");
    });
});
//# sourceMappingURL=email.routes.spec.js.map