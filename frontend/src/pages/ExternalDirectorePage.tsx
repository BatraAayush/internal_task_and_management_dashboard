import React, { useEffect, useState } from 'react';
import { externalService } from '../services/api';
import { Globe, Mail, Phone, Building2, MapPin } from 'lucide-react';
import type { ExternalUser } from '../types';

export const ExternalDirectoryPage: React.FC = () => {
  const [users, setUsers] = useState<ExternalUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExternalUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await externalService.getDirectory();
        setUsers(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch partner directory');
      } finally {
        setLoading(false);
      }
    };
    fetchExternalUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">External Partner Directory</h1>
        <p className="text-slate-400 text-sm mt-1">Live data ingested from upstream external public API with timeout handling and error bounds.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-800/40 rounded-xl border border-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">@{user.username}</span>
                </div>
                
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.city}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-xs text-indigo-400">
                <Globe className="w-3.5 h-3.5" />
                <span>{user.website}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};