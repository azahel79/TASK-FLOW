import prisma from "../../lib/prisma";
import { AppError } from "../../utils";
type TaskStatus = "pending" | "in_progress" | "done";

interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: number;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

interface PaginationParams {
  page: number;
  limit: number;
  status?: TaskStatus;
  search?: string;
  userId: number;
}

export class TasksService {
  async findByProject(projectId: number, { page, limit, status, search, userId }: PaginationParams) {
    const skip = (page - 1) * limit;

    // Verificar que el proyecto pertenezca al usuario
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      throw new AppError("Proyecto no encontrado", 404);
    }

    const where: Record<string, unknown> = { projectId };

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
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findById(id: number, userId: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { select: { id: true, name: true, userId: true } } },
    });

    if (!task) {
      throw new AppError("Tarea no encontrada", 404);
    }

    if (task.project.userId !== userId) {
      throw new AppError("No tienes acceso a esta tarea", 403);
    }

    return task;
  }

  async create(data: CreateTaskDto, userId: number) {
    // Verificar que el proyecto pertenezca al usuario
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId },
    });
    if (!project) {
      throw new AppError("Proyecto no encontrado", 404);
    }

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status || "pending",
        projectId: data.projectId,
      },
    });
  }

  async update(id: number, data: UpdateTaskDto, userId: number) {
    await this.findById(id, userId);

    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number, userId: number) {
    await this.findById(id, userId);

    return prisma.task.delete({ where: { id } });
  }
}

export const tasksService = new TasksService();