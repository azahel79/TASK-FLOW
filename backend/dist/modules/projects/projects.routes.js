"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const projects_controller_1 = require("./projects.controller");
const router = (0, express_1.Router)();
const createValidation = (0, middleware_1.validate)({
    required: ["name"],
    optional: ["description"],
});
const updateValidation = (0, middleware_1.validate)({
    optional: ["name", "description"],
});
router.get("/", projects_controller_1.projectsController.getAll);
router.get("/:id", projects_controller_1.projectsController.getById);
router.post("/", createValidation, projects_controller_1.projectsController.create);
router.put("/:id", updateValidation, projects_controller_1.projectsController.update);
router.delete("/:id", projects_controller_1.projectsController.delete);
exports.default = router;
//# sourceMappingURL=projects.routes.js.map