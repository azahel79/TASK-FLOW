import prisma from "../../lib/prisma";
import { AppError } from "../../utils";

interface CreateProjectDto {
  name: string;
  description?: string;
  userId: number;
}

interface UpdateProjectDto {
  name?: string;
  description?: string;
}

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  userId: number;
}

export class ProjectsService {
  async findAll({ page, limit, search, userId }: PaginationParams) {
    const skip = (page - 1) * limit;

    const where: any = { userId };

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
      prisma.project.findMany({
        where,
        include: { _count: { select: { tasks: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  async findById(id: number, userId: number) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        tasks: { orderBy: { createdAt: "desc" } },
        _count: { select: { tasks: true } },
      },
    });

    if (!project) {
      throw new AppError("Proyecto no encontrado", 404);
    }

    return project;
  }

  async create(data: CreateProjectDto) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        userId: data.userId,
      },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async update(id: number, data: UpdateProjectDto, userId: number) {
    await this.findById(id, userId);

    return prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async delete(id: number, userId: number) {
    await this.findById(id, userId);

    return prisma.project.delete({ where: { id } });
  }
}

export const projectsService = new ProjectsService();