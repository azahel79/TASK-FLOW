import { Router } from "express";
import { validate } from "../../middleware";
import { projectsController } from "./projects.controller";

const router = Router();

const createValidation = validate({
  required: ["name"],
  optional: ["description"],
});

const updateValidation = validate({
  optional: ["name", "description"],
});

router.get("/", projectsController.getAll);
router.get("/:id", projectsController.getById);
router.post("/", createValidation, projectsController.create);
router.put("/:id", updateValidation, projectsController.update);
router.delete("/:id", projectsController.delete);

export default router;