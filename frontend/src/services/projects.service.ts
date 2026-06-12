import api from '@/lib/api';
import type {
  ApiResponse,
  CreateProjectRequest,
  PaginatedResponse,
  Project,
  UpdateProjectRequest,
} from '@/types';

export const projectsService = {
  async getAll(page = 1, limit = 10): Promise<PaginatedResponse<Project>> {
    const response = await api.get<PaginatedResponse<Project>>('/projects', {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(id: string): Promise<Project> {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  async create(data: CreateProjectRequest): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};