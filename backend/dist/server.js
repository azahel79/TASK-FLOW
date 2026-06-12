"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const startServer = () => {
    const server = app_1.default.listen(config_1.config.port, () => {
        console.log(`Servidor corriendo en http://localhost:${config_1.config.port}`);
        console.log(`API disponible en http://localhost:${config_1.config.port}/api`);
        console.log(`Health check en http://localhost:${config_1.config.port}/api/health`);
    });
    server.on("error", (error) => {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    });
};
startServer();
//# sourceMappingURL=server.js.map