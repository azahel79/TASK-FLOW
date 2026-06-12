"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksController = exports.TasksController = void 0;
const middleware_1 = require("../../middleware");
const utils_1 = require("../../utils");
const tasks_service_1 = require("./tasks.service");
const statusToDb = (status) => {
    if (!status)
        return undefined;
    const normalized = status.toLowerCase();
    return normalized;
};
const statusToApi = (status) => {
    return status.toUpperCase();
};
const serializeTask = (task) => ({
    ...task,
    status: statusToApi(task.status),
});
class TasksController {
    constructor() {
        this.getByProject = (0, middleware_1.asyncHandler)(async (req, res) => {
            const projectId = parseInt(String(req.params.projectId));
            const page = parseInt(String(req.query.page)) || 1;
            const limit = parseInt(String(req.query.limit)) || 10;
            const status = statusToDb(req.query.status);
            const search = req.query.search;
            const userId = req.userId;
            const { tasks, total } = await tasks_service_1.tasksService.findByProject(projectId, {
                page,
                limit,
                status,
                search,
                userId,
            });
            return (0, utils_1.sendPaginated)(res, tasks.map(serializeTask), total, page, limit);
        });
        this.getById = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(String(req.params.id || req.params.taskId));
            const userId = req.userId;
            const task = await tasks_service_1.tasksService.findById(id, userId);
            return (0, utils_1.sendSuccess)(res, serializeTask(task));
        });
        this.create = (0, middleware_1.asyncHandler)(async (req, res) => {
            const { title, description } = req.body;
            const status = statusToDb(req.body.status);
            const projectId = parseInt(String(req.params.projectId || req.body.projectId));
            const userId = req.userId;
            const task = await tasks_service_1.tasksService.create({ title, description, status, projectId }, userId);
            return (0, utils_1.sendSuccess)(res, serializeTask(task), 201, "Tarea creada exitosamente");
        });
        this.update = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(String(req.params.id || req.params.taskId));
            const userId = req.userId;
            const { title, description } = req.body;
            const status = statusToDb(req.body.status);
            const task = await tasks_service_1.tasksService.update(id, { title, description, status }, userId);
            return (0, utils_1.sendSuccess)(res, serializeTask(task), 200, "Tarea actualizada exitosamente");
        });
        this.delete = (0, middleware_1.asyncHandler)(async (req, res) => {
            const id = parseInt(String(req.params.id || req.params.taskId));
            const userId = req.userId;
            await tasks_service_1.tasksService.delete(id, userId);
            return (0, utils_1.sendSuccess)(res, null, 200, "Tarea eliminada exitosamente");
        });
    }
}
exports.TasksController = TasksController;
exports.tasksController = new TasksController();
//# sourceMappingURL=tasks.controller.js.map