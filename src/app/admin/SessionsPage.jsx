import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCcw, 
  FileText,
  Filter
} from 'lucide-react';

// Hooks aur Components
import { useSessions } from '../../features/sessions/hooks/useSessions';
import SessionDetails from '../../features/sessions/components/SessionDetails';

export default function SessionsPage() {
  const { sessions, loading, refresh } = useSessions();
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search logic
  const filteredSessions = sessions.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interaction Logs</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Review AI assistant conversations and clinical flags.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={refresh}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Logs" value={sessions.length} icon={<FileText size={20}/>} color="blue" />
        <StatCard 
          label="Critical Flags" 
          value={sessions.filter(s => s.status === 'flagged').length} 
          icon={<AlertCircle size={20}/>} 
          color="red" 
        />
        <StatCard 
          label="Live Active" 
          value={sessions.filter(s => s.status === 'active').length} 
          icon={<Clock size={20}/>} 
          color="amber" 
        />
        <StatCard label="Avg. Response" value="1.2s" icon={<CheckCircle2 size={20}/>} color="emerald" />
      </div>

      {/* 3. LOGS TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session / Time</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Duration</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSessions.map((session) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={session.id} 
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="p-6">
                    <span className="text-sm font-bold text-slate-800">{session.id}</span>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <Clock size={12} /> {session.startTime}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-sm font-bold text-slate-700">{session.patientName}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px] font-medium italic">
                      {session.summary}
                    </div>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="p-6 text-sm font-mono text-slate-500 font-bold">
                    {session.duration}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => setSelectedSession(session)}
                      className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-md rounded-2xl transition-all active:scale-90"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredSessions.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-medium">No matching sessions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. DETAIL PANEL (MODAL) */}
      <AnimatePresence>
        {selectedSession && (
          <SessionDetails 
            session={selectedSession} 
            onClose={() => setSelectedSession(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** * Sub-Component: Status Badge
 */
function StatusBadge({ status }) {
  const configs = {
    flagged: "bg-red-50 text-red-600 border-red-100 italic",
    active: "bg-blue-50 text-blue-600 border-blue-100 animate-pulse",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[10px] font-black border uppercase tracking-tight ${configs[status]}`}>
      {status === 'flagged' && <AlertCircle size={12} />}
      {status === 'completed' && <CheckCircle2 size={12} />}
      {status}
    </span>
  );
}

/** * Sub-Component: Stat Card
 */
function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50"
  };

  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}