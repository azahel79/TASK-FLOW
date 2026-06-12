import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // AppError conocido (operacional)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Errores de Prisma
  if (err instanceof PrismaClientKnownRequestError) {
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