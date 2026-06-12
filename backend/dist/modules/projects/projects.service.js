"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsService = exports.ProjectsService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const utils_1 = require("../../utils");
class ProjectsService {
    async findAll({ page, limit, search, userId }) {
        const skip = (page - 1) * limit;
        const where = { userId };
        if (search) {
            where.AND = [
                {
                    OR: [
                        { name: { contains: search } },
                        { description: { contains: search } },
                    ],
                },
            ];
        }
        const [projects, total] = await Promise.all([
            prisma_1.default.project.findMany({
                where,
                include: { _count: { select: { tasks: true } } },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.default.project.count({ where }),
        ]);
        return { projects, total };
    }
    async findById(id, userId) {
        const project = await prisma_1.default.project.findFirst({
            where: { id, userId },
            include: {
                tasks: { orderBy: { createdAt: "desc" } },
                _count: { select: { tasks: true } },
            },
        });
        if (!project) {
            throw new utils_1.AppError("Proyecto no encontrado", 404);
        }
        return project;
    }
    async create(data) {
        return prisma_1.default.project.create({
            data: {
                name: data.name,
                description: data.description || null,
                userId: data.userId,
            },
            include: { _count: { select: { tasks: true } } },
        });
    }
    async update(id, data, userId) {
        await this.findById(id, userId);
        return prisma_1.default.project.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
            },
            include: { _count: { select: { tasks: true } } },
        });
    }
    async delete(id, userId) {
        await this.findById(id, userId);
        return prisma_1.default.project.delete({ where: { id } });
    }
}
exports.ProjectsService = ProjectsService;
exports.projectsService = new ProjectsService();
//# sourceMappingURL=projects.service.js.map