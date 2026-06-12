"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const middleware_1 = require("../../middleware");
const router = (0, express_1.Router)();
router.post("/register", (0, middleware_1.validate)({
    required: ["name", "email", "password"],
}), auth_controller_1.authController.register);
router.post("/login", (0, middleware_1.validate)({
    required: ["email", "password"],
}), auth_controller_1.authController.login);
router.get("/profile", middleware_1.authenticate, auth_controller_1.authController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map