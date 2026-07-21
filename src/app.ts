import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import emailRouter from "./modules/email/index.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.CORS_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use("/email", emailRouter);

app.use(errorHandler);

export default app;