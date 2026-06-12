import { Response } from "express";
import { asyncHandler, AuthRequest } from "../../middleware";
import { sendSuccess, sendPaginated } from "../../utils";
import { tasksService } from "./tasks.service";

type ApiTaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";
type DbTaskStatus = "pending" | "in_progress" | "done";

const statusToDb = (status?: string): DbTaskStatus | undefined => {
  if (!status) return undefined;

  const normalized = status.toLowerCase() as DbTaskStatus;
  return normalized;
};

const statusToApi = (status: string): ApiTaskStatus => {
  return status.toUpperCase() as ApiTaskStatus;
};

const serializeTask = <T extends { status: string }>(task: T) => ({
  ...task,
  status: statusToApi(task.status),
});

export class TasksController {
  getByProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const projectId = parseInt(String(req.params.projectId));
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 10;
    const status = statusToDb(req.query.status as string | undefined);
    const search = req.query.search as string | undefined;
    const userId = req.userId!;

    const { tasks, total } = await tasksService.findByProject(projectId, {
      page,
      limit,
      status,
      search,
      userId,
    });

    return sendPaginated(res, tasks.map(serializeTask), total, page, limit);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(String(req.params.id || req.params.taskId));
    const userId = req.userId!;
    const task = await tasksService.findById(id, userId);

    return sendSuccess(res, serializeTask(task));
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description } = req.body;
    const status = statusToDb(req.body.status);
    const projectId = parseInt(String(req.params.projectId || req.body.projectId));
    const userId = req.userId!;
    const task = await tasksService.create(
      { title, description, status, projectId },
      userId
    );

    return sendSuccess(res, serializeTask(task), 201, "Tarea creada exitosamente");
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(String(req.params.id || req.params.taskId));
    const userId = req.userId!;
    const { title, description } = req.body;
    const status = statusToDb(req.body.status);
    const task = await tasksService.update(id, { title, description, status }, userId);

    return sendSuccess(res, serializeTask(task), 200, "Tarea actualizada exitosamente");
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = parseInt(String(req.params.id || req.params.taskId));
    const userId = req.userId!;
    await tasksService.delete(id, userId);

    return sendSuccess(res, null, 200, "Tarea eliminada exitosamente");
  });
}

export const tasksController = new TasksController();
