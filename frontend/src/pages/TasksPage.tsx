import React, { useEffect, useState, useCallback, type MouseEvent } from 'react';
import { Search, Plus, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import { taskService, userService } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { TaskDetailsModal } from './TaskDetailsModal';
import { CreateTaskModal } from './CreateTaskModal';
import type { Task, User } from '../types';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filters & Pagination State
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks({
        page,
        limit: 8,
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        assignee: assigneeFilter ? parseInt(assigneeFilter) : undefined,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      setTasks(res.data.items);
      setTotalPages(res.data.total_pages);
      setTotalCount(res.data.total);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, priorityFilter, assigneeFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    userService.getUsers().then((res) => setUsers(res.data)).catch(console.error);
  }, []);

  const handleDelete = async (e: MouseEvent, taskId: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        console.error('Failed to delete task', err);
      }
    }
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Task Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Search, organize, filter, and modify engineering assignments</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Create Task
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-800">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks by name or description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => { setAssigneeFilter(e.target.value); setPage(1); }}
          className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {/* Task Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Task Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Loading records from backend...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No tasks match the active filters.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => handleRowClick(task)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white line-clamp-1">{task.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{task.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300 text-xs">
                      {task.assignee?.name ? (
                        <span className="flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                          {task.assignee.name}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {task.due_date ? (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-600">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <button
                        onClick={(e) => handleDelete(e, task.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalCount}
          limit={8}
          onPageChange={setPage}
        />
      </div>

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        users={users}
        onTaskUpdated={() => {
          setIsDetailOpen(false);
          fetchTasks();
        }}
      />

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        users={users}
        onCreated={fetchTasks}
      />
    </div>
  );
};