import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { ExternalDirectoryPage } from './pages/ExternalDirectorePage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'directory'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
        {activeTab === 'tasks' && <TasksPage />}
        {activeTab === 'directory' && <ExternalDirectoryPage />}
      </main>
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Task Management Internal Portal &bull; FastAPI + React TypeScript
      </footer>
    </div>
  );
};

export default App;