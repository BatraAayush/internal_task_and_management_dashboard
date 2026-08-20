import React, { useState, type FormEvent } from 'react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { taskService } from '../services/api';
import { MessageSquare, Send, FileEdit } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setAssignedTo(task.assigned_to?.toString() || '');
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
      setActiveTab('details');
    }
  }, [task]);

  if (!task) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await taskService.updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigned_to: assignedTo ? parseInt(assignedTo) : null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
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

  const commentsCount = task.comments?.length || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Management" maxWidth="max-w-2xl">
      <div className="space-y-5">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            Specifications & Details
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Activity & Notes
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
              activeTab === 'comments'
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {commentsCount}
            </span>
          </button>
        </div>

        {/* Tab 1: Task Specifications & Edit Form */}
        {activeTab === 'details' && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Title *</label>
              <input
                required
                type="text"
                placeholder="Task Title"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="flex justify-end pt-2 border-t border-slate-800/80">
              <Button size="sm" type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Activity & Notes */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write an internal note or progress update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Button size="sm" type="submit" disabled={!commentText.trim()} isLoading={isSubmitting}>
                <Send className="w-3.5 h-3.5 mr-1" />
                Post Note
              </Button>
            </form>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {commentsCount === 0 ? (
                <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                  No notes or comments logged yet. Use the field above to add the first entry.
                </div>
              ) : (
                task.comments?.map((c) => (
                  <div key={c.id} className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800 text-xs space-y-1.5 shadow-sm">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {c.author?.name || 'Team Member'}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-3">{c.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};