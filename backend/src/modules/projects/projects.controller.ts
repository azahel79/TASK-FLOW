import { Response } from "express";
import { asyncHandler, AuthRequest } from "../../middleware";
import { sendSuccess, sendPaginated } from "../../utils";
import { projectsService } from "./projects.service";

export class ProjectsController {
  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const userId = req.userId!;

    const { projects, total } = await projectsService.findAll({ page, limit, search, userId });

    return sendPaginated(res, projects, total, page, limit);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(String(req.params.id));
    const userId = req.userId!;
    const project = await projectsService.findById(id, userId);

    return sendSuccess(res, project);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    const userId = req.userId!;
    const project = await projectsService.create({ name, description, userId });

    return sendSuccess(res, project, 201, "Proyecto creado exitosamente");
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(String(req.params.id));
    const userId = req.userId!;
    const { name, description } = req.body;
    const project = await projectsService.update(id, { name, description }, userId);

    return sendSuccess(res, project, 200, "Proyecto actualizado exitosamente");
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(String(req.params.id));
    const userId = req.userId!;
    await projectsService.delete(id, userId);

    return sendSuccess(res, null, 200, "Proyecto eliminado exitosamente");
  });
}

export const projectsController = new ProjectsController();