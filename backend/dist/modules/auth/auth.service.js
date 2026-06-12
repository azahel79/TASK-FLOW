"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const utils_1 = require("../../utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
class AuthService {
    async register(data) {
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new utils_1.AppError("El email ya está registrado", 409);
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        const token = this.generateToken(user.id);
        return { user, token };
    }
    async login(data) {
        const user = await prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new utils_1.AppError("Credenciales inválidas", 401);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new utils_1.AppError("Credenciales inválidas", 401);
        }
        const token = this.generateToken(user.id);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
            token,
        };
    }
    async getProfile(userId) {
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: { projects: true },
                },
            },
        });
        if (!user) {
            throw new utils_1.AppError("Usuario no encontrado", 404);
        }
        return user;
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, config_1.config.jwt.secret, {
            expiresIn: config_1.config.jwt.expiresIn,
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map