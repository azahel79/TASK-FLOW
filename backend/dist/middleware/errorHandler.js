"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const utils_1 = require("../utils");
const library_1 = require("@prisma/client/runtime/library");
function errorHandler(err, _req, res, _next) {
    // AppError conocido (operacional)
    if (err instanceof utils_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }
    // Errores de Prisma
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return res.status(409).json({
                    success: false,
                    error: "Ya existe un registro con ese valor único",
                });
            case "P2025":
                return res.status(404).json({
                    success: false,
                    error: "Registro no encontrado",
                });
            case "P2003":
                return res.status(400).json({
                    success: false,
                    error: "Referencia inválida: el registro relacionado no existe",
                });
            default:
                return res.status(400).json({
                    success: false,
                    error: `Error de base de datos: ${err.code}`,
                });
        }
    }
    // Error no controlado
    console.error("Error no controlado:", err);
    return res.status(500).json({
        success: false,
        error: "Error interno del servidor",
    });
}
//# sourceMappingURL=errorHandler.js.map