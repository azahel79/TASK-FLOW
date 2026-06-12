import api from '@/lib/api';
import type {
  ApiResponse,
  CreateTaskRequest,
  PaginatedResponse,
  Task,
  TaskFilter,
  UpdateTaskRequest,
} from '@/types';

export const tasksService = {
  async getByProject(
    projectId: string,
    params?: { page?: number; limit?: number; status?: TaskFilter }
  ): Promise<PaginatedResponse<Task>> {
    const response = await api.get<PaginatedResponse<Task>>(
      `/projects/${projectId}/tasks`,
      { params }
    );
    return response.data;
  },

  async getById(projectId: string, taskId: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return response.data.data;
  },

  async create(projectId: string, data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>(
      `/projects/${projectId}/tasks`,
      data
    );
    return response.data.data;
  },

  async update(
    projectId: string,
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response.data.data;
  },

  async delete(projectId: string, taskId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};