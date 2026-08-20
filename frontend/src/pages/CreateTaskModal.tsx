import React, { useState, type FormEvent } from 'react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { taskService } from '../services/api';
import type { User, TaskStatus, TaskPriority } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onCreated: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  users,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      await taskService.createTask({
        title,
        description: description || undefined,
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setTitle('');
      setDescription('');
      onCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title *</label>
          <input
            required
            type="text"
            placeholder="e.g. Implement payment webhook verification"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
          <textarea
            rows={3}
            placeholder="Provide context, acceptance criteria, or relevant links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assignee</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Assignee</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};