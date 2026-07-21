import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import emailRouter from "./modules/email/index.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

const app = express();

// Cria a configuração do CORS em uma variável
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 204,
};

// Aplica a configuração no Express
app.use(cors(corsOptions));

// Garante que requisições prévias (OPTIONS) funcionem
app.options("*", cors(corsOptions));

app.use(express.json());
app.use("/email", emailRouter);
app.use(errorHandler);

export default app;
//# sourceMappingURL=app.js.map