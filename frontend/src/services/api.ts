import axios from 'axios';
import type { 
  Task, 
  CreateTaskPayload, 
  UpdateTaskPayload, 
  PaginatedTasksResponse, 
  DashboardMetrics, 
  User, 
  Comment, 
  ExternalUser, 
  TaskQueryParams 
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': '1',
  },
});

export const taskService = {
  getDashboard: () => api.get<DashboardMetrics>('/dashboard'),
  getTasks: (params: TaskQueryParams) => api.get<PaginatedTasksResponse>('/tasks', { params }),
  getTaskById: (id: number) => api.get<Task>(`/tasks/${id}`),
  createTask: (data: CreateTaskPayload) => api.post<Task>('/tasks', data),
  updateTask: (id: number, data: UpdateTaskPayload) => api.put<Task>(`/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete<void>(`/tasks/${id}`),
  addComment: (taskId: number, data: { comment: string; user_id: number }) =>
    api.post<Comment>(`/tasks/${taskId}/comments`, data),
};

export const userService = {
  getUsers: () => api.get<User[]>('/users'),
};

export const externalService = {
  getDirectory: () => api.get<ExternalUser[]>('/external/users'),
};

export default api;