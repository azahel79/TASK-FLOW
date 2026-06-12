import app from "./app";
import { config } from "./config";

const startServer = () => {
  const server = app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
    console.log(`API disponible en http://localhost:${config.port}/api`);
    console.log(`Health check en http://localhost:${config.port}/api/health`);
  });

  server.on("error", (error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  });
};

startServer();
