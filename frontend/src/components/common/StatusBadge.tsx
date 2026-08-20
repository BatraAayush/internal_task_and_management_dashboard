import React from 'react';
import { cn } from '../../utils/cn';
import type { TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles: Record<TaskStatus, string> = {
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'In Progress': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Blocked': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide",
      styles[status] || 'bg-slate-700/30 text-slate-400 border-slate-700',
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};