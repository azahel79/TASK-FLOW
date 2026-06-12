"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectTasksRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const tasks_controller_1 = require("./tasks.controller");
const router = (0, express_1.Router)();
const projectTasksRouter = (0, express_1.Router)({ mergeParams: true });
exports.projectTasksRouter = projectTasksRouter;
const createValidation = (0, middleware_1.validate)({
    required: ["title", "projectId"],
    optional: ["description", "status"],
    enums: { status: ["pending", "in_progress", "done", "PENDING", "IN_PROGRESS", "DONE"] },
});
const nestedCreateValidation = (0, middleware_1.validate)({
    required: ["title"],
    optional: ["description", "status", "projectId"],
    enums: { status: ["pending", "in_progress", "done", "PENDING", "IN_PROGRESS", "DONE"] },
});
const updateValidation = (0, middleware_1.validate)({
    optional: ["title", "description", "status"],
    enums: { status: ["pending", "in_progress", "done", "PENDING", "IN_PROGRESS", "DONE"] },
});
// Rutas heredadas bajo /api/tasks
router.get("/project/:projectId", tasks_controller_1.tasksController.getByProject);
// CRUD de tareas individuales
router.get("/:id", tasks_controller_1.tasksController.getById);
router.post("/", createValidation, tasks_controller_1.tasksController.create);
router.put("/:id", updateValidation, tasks_controller_1.tasksController.update);
router.delete("/:id", tasks_controller_1.tasksController.delete);
// Rutas anidadas bajo /api/projects/:projectId/tasks
projectTasksRouter.get("/", tasks_controller_1.tasksController.getByProject);
projectTasksRouter.get("/:taskId", tasks_controller_1.tasksController.getById);
projectTasksRouter.post("/", nestedCreateValidation, tasks_controller_1.tasksController.create);
projectTasksRouter.put("/:taskId", updateValidation, tasks_controller_1.tasksController.update);
projectTasksRouter.delete("/:taskId", tasks_controller_1.tasksController.delete);
exports.default = router;
//# sourceMappingURL=tasks.routes.js.map