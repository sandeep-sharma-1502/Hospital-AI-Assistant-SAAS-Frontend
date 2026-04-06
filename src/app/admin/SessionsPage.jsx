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
  Filter,
  Activity
} from 'lucide-react';

// Hooks aur Components
import { useSessions } from '../../features/sessions/hooks/useSessions';
import SessionDetails from '../../features/sessions/components/SessionDetails';

export default function SessionsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { sessions, meta, loading, refresh } = useSessions({ page, status: filter, limit: 10 });
  const [selectedSession, setSelectedSession] = useState(null);

  // Search logic (Client side name matching after fetch - ideal is backend but as per spec we keep it aligned)
  const filteredSessions = sessions.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (newStatus) => {
    setFilter(newStatus);
    setPage(1);
  };

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#09090b] min-h-screen font-sans text-slate-900 dark:text-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-zinc-500 italic">MedFlow Operational Terminal</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Interaction <span className="text-slate-200 dark:text-zinc-800">/</span> Logs</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Query Logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:text-zinc-700 w-72 focus:ring-2 focus:ring-blue-500/50 outline-none shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={refresh}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:text-white px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all active:scale-95 shadow-lg shadow-black/50"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin text-blue-500" : ""} />
            {loading ? "Syncing..." : "Refresh Matrix"}
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
        <StatCard label="Total Logs" value={meta.total || 0} icon={<FileText size={18}/>} color="blue" />
        <StatCard 
          label="Critical Flags" 
          value={loading ? '..' : 'Active'} 
          icon={<AlertCircle size={18}/>} 
          color="red" 
        />
        <StatCard 
          label="Live Active" 
          value={loading ? '..' : 'Node'} 
          icon={<Clock size={18}/>} 
          color="amber" 
        />
        <StatCard label="Response Vector" value="1.2s" icon={<CheckCircle2 size={18}/>} color="emerald" />
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 mb-6 relative z-10">
         {["All", "flagged", "active", "completed"].map(statusVal => (
            <button
              key={statusVal}
              onClick={() => handleFilterChange(statusVal)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter === statusVal
                  ? "bg-slate-900 text-white dark:bg-white/[0.08] dark:text-white border-slate-200 dark:border-white/10 shadow-lg"
                  : "bg-transparent text-slate-500 dark:text-zinc-600 border-transparent hover:text-slate-600 dark:text-zinc-400"
              }`}
            >
              {statusVal}
            </button>
          ))}
      </div>

      {/* 3. LOGS TABLE */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-slate-100 dark:border-white/[0.04] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/[0.04]">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.25em] italic">Session / Time</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.25em] italic">Patient Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.25em] italic">System Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.25em] italic">Duration</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-[0.25em] italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredSessions.map((session) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={session.id} 
                  className="hover:bg-blue-600/[0.02] transition-all group"
                >
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-800 dark:text-zinc-200 group-hover:text-blue-400 transition-colors uppercase italic">{session.id.split('-')[0]}</span>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-500 tracking-widest mt-1 flex items-center gap-1 font-bold uppercase">
                      <Clock size={12} className="opacity-50" /> {session.startTime}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-[12px] font-black uppercase text-slate-700 dark:text-zinc-300 italic group-hover:text-slate-900 dark:text-white transition-colors">{session.patientName}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold tracking-widest mt-1 uppercase italic truncate max-w-[200px]">
                      {session.summary}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-8 py-5 text-[11px] font-black tabular-nums tracking-widest text-slate-500 dark:text-zinc-500">
                    {session.duration}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setSelectedSession(session)}
                      className="p-3 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-600 hover:text-slate-900 dark:text-white rounded-2xl transition-all active:scale-90"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredSessions.length === 0 && !loading && (
            <div className="p-24 text-center bg-slate-50 dark:bg-zinc-950/20">
              <FileText className="mx-auto opacity-5 mb-6 text-slate-900 dark:text-white" size={80} />
              <p className="text-slate-400 dark:text-zinc-700 font-black uppercase tracking-[0.5em] text-[10px]">Zero Log Entries Found</p>
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {meta?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 relative z-10">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:text-white disabled:opacity-30 transition-all"
          >
            Prev
          </button>
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-600">
            Page {page} of {meta.totalPages}
          </span>
          <button 
            disabled={page === meta.totalPages}
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:text-white disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}

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
    flagged: "bg-rose-500/10 text-rose-500 border-rose-500/20 italic shadow-[0_0_15px_rgba(244,63,94,0.1)]",
    active: "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  return (
    <span className={`inline-flex items-center gap-2 py-1.5 px-3 rounded-xl text-[9px] font-black border uppercase tracking-widest ${configs[status?.toLowerCase()]}`}>
      {status === 'flagged' && <AlertCircle size={10} />}
      {status === 'completed' && <CheckCircle2 size={10} />}
      {status}
    </span>
  );
}

/** * Sub-Component: Stat Card
 */
function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border border-blue-500/20",
    red: "text-rose-500 bg-rose-500/10 border border-rose-500/20",
    amber: "text-amber-500 bg-amber-500/10 border border-amber-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0e] p-6 rounded-[32px] border border-slate-100 dark:border-white/[0.04] shadow-2xl flex flex-col gap-4 group hover:border-slate-200 dark:border-white/10 transition-all">
      <div className={`p-3 rounded-2xl self-start ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter tabular-nums mt-1">{value}</p>
      </div>
    </div>
  );
}