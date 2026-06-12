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
export declare class TasksService {
    findByProject(projectId: number, { page, limit, status, search, userId }: PaginationParams): Promise<{
        tasks: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: string;
            projectId: number;
            title: string;
        }[];
        total: number;
    }>;
    findById(id: number, userId: number): Promise<{
        project: {
            id: number;
            name: string;
            userId: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: string;
        projectId: number;
        title: string;
    }>;
    create(data: CreateTaskDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: string;
        projectId: number;
        title: string;
    }>;
    update(id: number, data: UpdateTaskDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: string;
        projectId: number;
        title: string;
    }>;
    delete(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: string;
        projectId: number;
        title: string;
    }>;
}
export declare const tasksService: TasksService;
export {};
//# sourceMappingURL=tasks.service.d.ts.map