import React from 'react';
import { cn } from '../../utils/cn';
import type { TaskPriority } from '../../types';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const styles: Record<TaskPriority, string> = {
    'Low': 'text-slate-400 bg-slate-800/80 border-slate-700',
    'Medium': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'High': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Urgent': 'text-rose-400 bg-rose-500/10 border-rose-500/20 font-semibold',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium",
      styles[priority] || 'text-slate-400 bg-slate-800 border-slate-700',
      className
    )}>
      {priority}
    </span>
  );
};