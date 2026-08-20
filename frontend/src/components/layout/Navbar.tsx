import React from 'react';
import { LayoutDashboard, CheckSquare, Users2, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'tasks' | 'directory';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'directory') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs: Array<{ id: 'dashboard' | 'tasks' | 'directory'; label: string; icon: React.ElementType }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare },
    { id: 'directory', label: 'External Directory', icon: Users2 },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base">DevBoard</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded font-mono">v1.0</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};