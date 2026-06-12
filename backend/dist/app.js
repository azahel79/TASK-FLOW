"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const middleware_1 = require("./middleware");
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware globales
app.use((0, cors_1.default)({ origin: config_1.config.cors.origin }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)(config_1.config.isProduction ? "combined" : "dev"));
// Rutas API
app.use("/api", routes_1.default);
// 404 para rutas no encontradas
app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Ruta no encontrada" });
});
// Middleware de errores (debe ir al final)
app.use(middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map