import React, { useState, type FormEvent } from 'react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { taskService } from '../services/api';
import { MessageSquare, Send } from 'lucide-react';
import type { Task, User, TaskStatus, TaskPriority } from '../types';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onTaskUpdated: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  users,
  onTaskUpdated,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'Pending');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'Medium');
  const [assignedTo, setAssignedTo] = useState<string>(task?.assigned_to?.toString() || '');

  React.useEffect(() => {
    if (task) {
      setStatus(task.status);
      setPriority(task.priority);
      setAssignedTo(task.assigned_to?.toString() || '');
    }
  }, [task]);

  if (!task) return null;

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      await taskService.updateTask(task.id, {
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
      });
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to update task', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      await taskService.addComment(task.id, {
        comment: commentText,
        user_id: 1,
      });
      setCommentText('');
      onTaskUpdated();
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Specifications & History" maxWidth="max-w-2xl">
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        <div>
          <h2 className="text-xl font-bold text-white">{task.title}</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md p-1.5 focus:border-indigo-500 focus:outline-none"
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
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md p-1.5 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Assignee</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-md p-1.5 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={handleUpdate} isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>

        <div className="border-t border-slate-800 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-semibold text-white">Activity & Notes ({task.comments?.length || 0})</h4>
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 mb-5">
            <input
              type="text"
              placeholder="Post an internal note or progress update..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Button size="sm" type="submit" disabled={!commentText.trim()} isLoading={isSubmitting}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>

          <div className="space-y-3">
            {task.comments?.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">No comments logged yet.</p>
            ) : (
              task.comments?.map((c) => (
                <div key={c.id} className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-xs space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-semibold text-slate-300">{c.author?.name || 'Team Member'}</span>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300">{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};