import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CheckCircle, Activity, ArrowUpRight } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital Overview</h1>
        <p className="text-slate-500">Real-time performance of your AI Assistant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sessions" value="12,482" trend="+12%" icon={Users} color="bg-blue-500" />
        <StatCard title="Bookings" value="842" trend="+5.4%" icon={Calendar} color="bg-purple-500" />
        <StatCard title="Success Rate" value="98.2%" trend="+0.2%" icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Active Users" value="154" trend="+18%" icon={Activity} color="bg-orange-500" />
      </div>

      {/* Placeholder for Chart */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">Analytics Chart Visualization</p>
        </div>
      </div>
    </div>
  );
}