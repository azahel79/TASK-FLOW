import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate, validate } from "../../middleware";

const router = Router();

router.post(
  "/register",
  validate({
    required: ["name", "email", "password"],
  }),
  authController.register
);

router.post(
  "/login",
  validate({
    required: ["email", "password"],
  }),
  authController.login
);

router.get("/profile", authenticate, authController.getProfile);

export default router;
