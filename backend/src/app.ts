import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware";
import { config } from "./config";
import routes from "./routes";

const app = express();

// Middleware globales
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(morgan(config.isProduction ? "combined" : "dev"));

// Rutas API
app.use("/api", routes);

// 404 para rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Ruta no encontrada" });
});

// Middleware de errores (debe ir al final)
app.use(errorHandler);

export default app;
