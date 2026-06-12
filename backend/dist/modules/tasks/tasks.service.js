"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksService = exports.TasksService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const utils_1 = require("../../utils");
class TasksService {
    async findByProject(projectId, { page, limit, status, search, userId }) {
        const skip = (page - 1) * limit;
        // Verificar que el proyecto pertenezca al usuario
        const project = await prisma_1.default.project.findFirst({
            where: { id: projectId, userId },
        });
        if (!project) {
            throw new utils_1.AppError("Proyecto no encontrado", 404);
        }
        const where = { projectId };
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [tasks, total] = await Promise.all([
            prisma_1.default.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.default.task.count({ where }),
        ]);
        return { tasks, total };
    }
    async findById(id, userId) {
        const task = await prisma_1.default.task.findUnique({
            where: { id },
            include: { project: { select: { id: true, name: true, userId: true } } },
        });
        if (!task) {
            throw new utils_1.AppError("Tarea no encontrada", 404);
        }
        if (task.project.userId !== userId) {
            throw new utils_1.AppError("No tienes acceso a esta tarea", 403);
        }
        return task;
    }
    async create(data, userId) {
        // Verificar que el proyecto pertenezca al usuario
        const project = await prisma_1.default.project.findFirst({
            where: { id: data.projectId, userId },
        });
        if (!project) {
            throw new utils_1.AppError("Proyecto no encontrado", 404);
        }
        return prisma_1.default.task.create({
            data: {
                title: data.title,
                description: data.description || null,
                status: data.status || "pending",
                projectId: data.projectId,
            },
        });
    }
    async update(id, data, userId) {
        await this.findById(id, userId);
        return prisma_1.default.task.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.status !== undefined && { status: data.status }),
            },
        });
    }
    async delete(id, userId) {
        await this.findById(id, userId);
        return prisma_1.default.task.delete({ where: { id } });
    }
}
exports.TasksService = TasksService;
exports.tasksService = new TasksService();
//# sourceMappingURL=tasks.service.js.map