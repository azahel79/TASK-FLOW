import { Request, Response } from "express";
import { asyncHandler } from "../../middleware";
import { sendSuccess } from "../../utils";
import { authService } from "./auth.service";
import { AuthRequest } from "../../middleware";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });

    return sendSuccess(res, result, 201, "Usuario registrado exitosamente");
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    return sendSuccess(res, result, 200, "Inicio de sesión exitoso");
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const user = await authService.getProfile(userId);

    return sendSuccess(res, user);
  });
}

export const authController = new AuthController();