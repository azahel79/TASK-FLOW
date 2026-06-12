"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const middleware_1 = require("../../middleware");
const utils_1 = require("../../utils");
const auth_service_1 = require("./auth.service");
class AuthController {
    constructor() {
        this.register = (0, middleware_1.asyncHandler)(async (req, res) => {
            const { name, email, password } = req.body;
            const result = await auth_service_1.authService.register({ name, email, password });
            return (0, utils_1.sendSuccess)(res, result, 201, "Usuario registrado exitosamente");
        });
        this.login = (0, middleware_1.asyncHandler)(async (req, res) => {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login({ email, password });
            return (0, utils_1.sendSuccess)(res, result, 200, "Inicio de sesión exitoso");
        });
        this.getProfile = (0, middleware_1.asyncHandler)(async (req, res) => {
            const userId = req.userId;
            const user = await auth_service_1.authService.getProfile(userId);
            return (0, utils_1.sendSuccess)(res, user);
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map