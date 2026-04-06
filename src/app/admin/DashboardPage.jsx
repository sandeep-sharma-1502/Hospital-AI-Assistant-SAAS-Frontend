import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Calendar, CheckCircle, Activity,
  ArrowUpRight, AlertCircle, RefreshCw, TrendingUp, Bot
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, Tooltip, Legend,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import apiClient from '../../services/apiClient';

// ─── Colour palette ──────────────────────────────────────────────────────────
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ title, value, trend, icon: Icon, gradient, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="relative overflow-hidden bg-white dark:bg-[#0c0c0e] rounded-3xl border border-slate-100 dark:border-white/[0.04] shadow-2xl p-6 group"
  >
    <div className={`absolute inset-0 opacity-10 ${gradient} blur-2xl group-hover:opacity-20 transition-opacity`} />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-5">
        <div className={`p-3 rounded-2xl ${gradient} bg-opacity-20 border border-slate-200 dark:border-white/5`}>
          <Icon size={22} className="text-slate-900 dark:text-white" />
        </div>
        <span className="flex items-center text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
          <ArrowUpRight size={11} className="mr-1" />
          {trend}
        </span>
      </div>
      <p className="text-slate-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      {loading ? (
        <div className="h-8 w-20 bg-white/5 animate-pulse rounded-xl mt-1" />
      ) : (
        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight tabular-nums italic">{value}</p>
      )}
    </div>
  </motion.div>
);

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-[10px] uppercase tracking-widest font-black py-3 px-4 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10">
      <p className="text-slate-500 dark:text-zinc-500 mb-2 italic">
        {new Date(label).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <div className="space-y-1">
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}:</span> 
          <span className="text-slate-900 dark:text-white tabular-nums">{p.value}</span>
        </div>
      ))}
      </div>
    </div>
  );
};

// ─── Custom Pie Label ────────────────────────────────────────────────────────
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSessions: 0, totalAppointments: 0, totalDoctors: 0, totalPatients: 0,
    chartData: [], appointmentBreakdown: [], appointmentTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.get('/admin/analytics/dashboard');
      if (res.data?.data) setStats(res.data.data);
    } catch (err) {
      setError('Could not load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  // Format dates for X-axis tick
  const fmtDay = (str) => new Date(str).toLocaleDateString('en-IN', { weekday: 'short' });

  // Merge session + appointment trend for combined chart
  const combinedTrend = stats.chartData.map((s, i) => ({
    date: s.date,
    Sessions: s.sessions,
    Appointments: stats.appointmentTrend[i]?.appointments ?? 0,
  }));

  const breakdownWithLabels = (stats.appointmentBreakdown || []).map((d) => ({
    ...d,
    name: STATUS_LABELS[d.name] || d.name,
  }));

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#09090b] min-h-screen font-sans text-slate-800 dark:text-zinc-100 relative overflow-hidden space-y-8">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-zinc-500 italic">MedFlow Operational Terminal</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase leading-none">
            Hospital <span className="text-slate-200 dark:text-zinc-800">/</span> Overview
          </h1>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:text-white rounded-2xl transition-all shadow-sm font-black text-[10px] uppercase tracking-widest active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing...' : 'Refresh Matrix'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-[10px] uppercase tracking-widest font-black relative z-10">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="AI Sessions" value={stats.totalSessions.toLocaleString()} trend="Live" icon={Bot} gradient="bg-blue-600" loading={loading} />
        <StatCard title="Appointments" value={stats.totalAppointments.toLocaleString()} trend="Auto" icon={Calendar} gradient="bg-violet-600" loading={loading} />
        <StatCard title="Patients" value={stats.totalPatients.toLocaleString()} trend="Active" icon={Users} gradient="bg-emerald-600" loading={loading} />
        <StatCard title="Doctors" value={stats.totalDoctors.toLocaleString()} trend="Online" icon={CheckCircle} gradient="bg-orange-500" loading={loading} />
      </div>

      {/* ── COMBINED AREA + BAR CHART ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#0c0c0e] p-7 rounded-[40px] border border-slate-100 dark:border-white/[0.04] shadow-2xl relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800 dark:text-zinc-100 italic">Weekly Activity Core</h3>
            <p className="text-slate-500 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sessions & Appointments — Last 7 Days</p>
          </div>
          <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center gap-2 text-slate-600 dark:text-zinc-400"><span className="w-2.5 h-2.5 rounded bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" /> Sessions</span>
            <span className="flex items-center gap-2 text-slate-600 dark:text-zinc-400"><span className="w-2.5 h-2.5 rounded bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]" /> Appointments</span>
          </div>
        </div>

        {loading ? (
          <div className="h-56 bg-white/5 animate-pulse rounded-2xl" />
        ) : combinedTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={combinedTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAppts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tickFormatter={fmtDay} tick={{ fontSize: 10, fontWeight: 900, fill: '#52525b', textTransform: 'uppercase' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: '#52525b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="Sessions" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradSessions)" dot={{ r: 3.5, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="Appointments" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradAppts)" dot={{ r: 3.5, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No activity data yet.</div>
        )}
      </motion.div>

      {/* ── PIE + BAR ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Appointment Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white dark:bg-[#0c0c0e] p-7 rounded-[40px] border border-slate-100 dark:border-white/[0.04] shadow-2xl relative z-10"
        >
          <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800 dark:text-zinc-100 italic mb-1">Appointment Matrix</h3>
          <p className="text-slate-500 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-5">Status distribution</p>

          {loading ? (
            <div className="h-52 bg-white/5 animate-pulse rounded-2xl" />
          ) : breakdownWithLabels.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={breakdownWithLabels}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={PieLabel}
                >
                  {breakdownWithLabels.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [val, name]} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No appointment data yet.</div>
          )}
        </motion.div>

        {/* Daily Appointment Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#0c0c0e] p-7 rounded-[40px] border border-slate-100 dark:border-white/[0.04] shadow-2xl relative z-10"
        >
          <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-800 dark:text-zinc-100 italic mb-1">Weekly Pulse</h3>
          <p className="text-slate-500 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-5">Daily booking count</p>

          {loading ? (
            <div className="h-52 bg-white/5 animate-pulse rounded-2xl" />
          ) : (stats.appointmentTrend || []).length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={stats.appointmentTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtDay} tick={{ fontSize: 10, fontWeight: 900, fill: '#52525b', textTransform: 'uppercase' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: '#52525b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="appointments" name="Appointments" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">No appointment data this week.</div>
          )}
        </motion.div>
      </div>

      {/* ── QUICK INSIGHT BOX ─────────────────────────────────────────── */}
      {!loading && stats.totalSessions > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-gradient-to-r from-blue-900/30 to-violet-900/30 border border-blue-500/20 p-8 rounded-[40px] text-slate-900 dark:text-white shadow-[0_0_50px_rgba(37,99,235,0.1)] relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="font-black text-[10px] text-slate-700 dark:text-zinc-300 uppercase tracking-[0.3em] italic">System Insight</span>
          </div>
          <p className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            {stats.totalSessions > 0
              ? `${((stats.totalAppointments / stats.totalSessions) * 100).toFixed(1)}% Core Conversion Rate`
              : 'Zero Sync'}
          </p>
          <p className="text-slate-500 dark:text-zinc-500 text-xs font-bold mt-2 uppercase tracking-widest">
            {stats.totalAppointments} visits originated from {stats.totalSessions} active AI sessions
          </p>
        </motion.div>
      )}
    </div>
  );
}