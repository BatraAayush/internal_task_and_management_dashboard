export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  comment: string;
  created_at: string;
  author?: User;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: number | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  assignee?: User | null;
  comments?: Comment[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: number | null;
  due_date?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: number | null;
  due_date?: string | null;
}

export interface PaginatedTasksResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  items: Task[];
}

export interface DashboardMetrics {
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  blocked_tasks: number;
  overdue_tasks: number;
  my_tasks_count: number;
}

export interface ExternalUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company_name: string;
  city: string;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignee?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}