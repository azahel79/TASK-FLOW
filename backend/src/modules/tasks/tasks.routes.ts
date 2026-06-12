import { Router } from "express";
import { validate } from "../../middleware";
import { tasksController } from "./tasks.controller";

const router = Router();
const projectTasksRouter = Router({ mergeParams: true });

const createValidation = validate({
  required: ["title", "projectId"],
  optional: ["description", "status"],
  enums: { status: ["pending", "in_progress", "done", "PENDING", "IN_PROGRESS", "DONE"] },
});

const nestedCreateValidation = validate({
  required: ["title"],
  optional: ["description", "status", "projectId"],
  enums: { status: ["pending", "in_progress", "done", "PENDING", "IN_PROGRESS", "DONE"] },
});

const updateValidation = validate({
  optional: ["title", "description", "status"],
  enums: { status: ["pending", "in_progress", "done", "PENDING", "IN_PROGRESS", "DONE"] },
});

// Rutas heredadas bajo /api/tasks
router.get("/project/:projectId", tasksController.getByProject);

// CRUD de tareas individuales
router.get("/:id", tasksController.getById);
router.post("/", createValidation, tasksController.create);
router.put("/:id", updateValidation, tasksController.update);
router.delete("/:id", tasksController.delete);

// Rutas anidadas bajo /api/projects/:projectId/tasks
projectTasksRouter.get("/", tasksController.getByProject);
projectTasksRouter.get("/:taskId", tasksController.getById);
projectTasksRouter.post("/", nestedCreateValidation, tasksController.create);
projectTasksRouter.put("/:taskId", updateValidation, tasksController.update);
projectTasksRouter.delete("/:taskId", tasksController.delete);

export default router;
export { projectTasksRouter };
