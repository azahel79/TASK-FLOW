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
export declare class ProjectsService {
    findAll({ page, limit, search, userId }: PaginationParams): Promise<{
        projects: ({
            _count: {
                tasks: number;
            };
        } & {
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            description: string | null;
        })[];
        total: number;
    }>;
    findById(id: number, userId: number): Promise<{
        _count: {
            tasks: number;
        };
        tasks: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: string;
            projectId: number;
            title: string;
        }[];
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
    }>;
    create(data: CreateProjectDto): Promise<{
        _count: {
            tasks: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
    }>;
    update(id: number, data: UpdateProjectDto, userId: number): Promise<{
        _count: {
            tasks: number;
        };
    } & {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
    }>;
    delete(id: number, userId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
    }>;
}
export declare const projectsService: ProjectsService;
export {};
//# sourceMappingURL=projects.service.d.ts.map