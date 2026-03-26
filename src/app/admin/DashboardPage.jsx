import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle, Activity, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import apiClient from '../../services/apiClient';

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={12} className="mr-1" /> {trend}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiClient.get('/admin/analytics/dashboard');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const maxSessions = Math.max(...(stats.chartData.map(d => d.sessions) || [0]), 10);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hospital Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance of your AI Assistant.</p>
        </div>
        <button 
          onClick={loadStats}
          disabled={loading}
          className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw size={32} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total AI Sessions" 
              value={stats.totalSessions.toLocaleString()} 
              trend="Live" 
              icon={Activity} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Appointments Booked" 
              value={stats.totalAppointments.toLocaleString()} 
              trend="Auto" 
              icon={Calendar} 
              color="bg-purple-500" 
            />
            <StatCard 
              title="Total Patients" 
              value={stats.totalPatients.toLocaleString()} 
              trend="Active" 
              icon={Users} 
              color="bg-emerald-500" 
            />
            <StatCard 
              title="Active Doctors" 
              value={stats.totalDoctors.toLocaleString()} 
              trend="Online" 
              icon={CheckCircle} 
              color="bg-orange-500" 
            />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">AI Conversational Activity (Last 7 Days)</h3>
            
            <div className="h-64 flex items-end gap-2 sm:gap-4 w-full">
              {stats.chartData && stats.chartData.length > 0 ? (
                stats.chartData.map((data, index) => {
                  const heightPercentage = Math.max((data.sessions / maxSessions) * 100, 2); // min height of 2%
                  const label = new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-10">
                        {data.sessions} Sessions
                      </div>
                      
                      {/* Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full max-w-[48px] bg-blue-500 rounded-t-xl opacity-90 group-hover:opacity-100 group-hover:bg-blue-600 transition-colors"
                      />
                      
                      {/* X-Axis Label */}
                      <span className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">{label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No activity data available.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}