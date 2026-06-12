"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === "production";
const required = (key, fallback = "") => {
    const value = process.env[key] || fallback;
    if (isProduction && !value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
const parseCorsOrigins = (origin) => {
    if (origin === "*")
        return origin;
    return origin.split(",").map((item) => item.trim()).filter(Boolean);
};
const jwtSecret = required("JWT_SECRET", isProduction ? "" : "dev-secret-change-me");
if (isProduction && jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
}
exports.config = {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    port: parseInt(process.env.PORT || "3000", 10),
    databaseUrl: required("DATABASE_URL"),
    cors: {
        origin: parseCorsOrigins(process.env.CORS_ORIGIN || (isProduction ? "" : "*")),
    },
    jwt: {
        secret: jwtSecret,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
};
//# sourceMappingURL=index.js.map