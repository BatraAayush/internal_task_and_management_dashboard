import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  ListFilter, 
  ShieldAlert,
  ArrowUpRight 
} from 'lucide-react';
import { taskService } from '../services/api';
import { Button } from '../components/common/Button';
import type { DashboardMetrics } from '../types';

interface DashboardPageProps {
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'directory') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await taskService.getDashboard();
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-xl border border-slate-800" />
        ))}
      </div>
    );
  }

  const statCards = [
    { title: 'Total Tasks', value: metrics?.total_tasks || 0, icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Pending', value: metrics?.pending_tasks || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'In Progress', value: metrics?.in_progress_tasks || 0, icon: ListFilter, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { title: 'Completed', value: metrics?.completed_tasks || 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Blocked', value: metrics?.blocked_tasks || 0, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { title: 'Overdue Tasks', value: metrics?.overdue_tasks || 0, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Live aggregated performance metrics and progress tracking</p>
        </div>
        <Button onClick={() => setActiveTab('tasks')}>
          Manage All Tasks
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.title}</span>
                <div className={`p-2.5 rounded-lg ${card.bg} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-white">{card.value}</span>
                <span className="text-xs text-slate-500">items</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-900/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">Tasks Assigned to Current Session</h3>
            <p className="text-sm text-slate-400 mt-1">
              You currently have <span className="text-indigo-400 font-semibold">{metrics?.my_tasks_count || 0}</span> active tasks in your work queue.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setActiveTab('tasks')}>View Queue</Button>
        </div>
      </div>
    </div>
  );
};