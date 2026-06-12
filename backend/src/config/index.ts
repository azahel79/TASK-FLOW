import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const required = (key: string, fallback = "") => {
  const value = process.env[key] || fallback;

  if (isProduction && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parseCorsOrigins = (origin: string) => {
  if (origin === "*") return origin;
  return origin.split(",").map((item) => item.trim()).filter(Boolean);
};

const jwtSecret = required("JWT_SECRET", isProduction ? "" : "dev-secret-change-me");

if (isProduction && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

export const config = {
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
