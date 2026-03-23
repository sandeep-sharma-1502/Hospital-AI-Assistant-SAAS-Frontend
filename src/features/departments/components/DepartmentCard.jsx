import React from 'react';
import { Layers, Edit2, Trash2, ChevronRight, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DepartmentCard({ dept, onEdit, onDelete, onView, isSelected }) {
  return (
    <motion.div 
      // layout="position" ensures internal elements don't stretch 
      // weirdly when the grid container changes size.
      layout="position" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={!isSelected ? { y: -8, transition: { duration: 0.2 } } : {}}
      onClick={() => onView(dept.id)}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 40,
        layout: { duration: 0.4, type: 'spring' } 
      }}
      className={`group relative border rounded-[36px] p-7 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[240px] transition-colors duration-500 ${
        isSelected 
        ? 'bg-blue-600/10 border-blue-500 shadow-[0_20px_50px_rgba(37,99,235,0.15)] z-20' 
        : 'bg-zinc-900/40 border-white/[0.04] hover:border-blue-500/30 hover:bg-zinc-900/60'
      }`}
    >
      {/* Decorative Background Mesh Glow */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 blur-[60px] rounded-full transition-opacity duration-700 ${
        isSelected ? 'bg-blue-500/30 opacity-100' : 'bg-blue-500/5 opacity-0 group-hover:opacity-100'
      }`} />

      <div className="relative z-10">
        {/* Top Section: Icon & Status */}
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-[22px] transition-all duration-500 transform ${
            isSelected 
            ? 'bg-blue-600 text-white shadow-lg rotate-3' 
            : 'bg-zinc-950 text-blue-500 border border-white/[0.03] group-hover:scale-110 group-hover:-rotate-3'
          }`}>
            <Layers size={22} strokeWidth={2.5} />
          </div>

          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all duration-500 ${
            dept.isActive 
            ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' 
            : 'bg-rose-500/5 border-rose-500/10 text-rose-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              dept.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-rose-500'
            }`} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {dept.isActive ? 'Active' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="mb-4">
          <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-1 italic">
            {dept.code || 'UNIT-00'}
          </p>
          <h3 className="text-xl font-black text-white tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors leading-tight">
            {dept.name}
          </h3>
          
          <div className={`flex items-center gap-2 mt-4 transition-all duration-500 ${
            isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'
          }`}>
            <Cpu size={12} className="text-zinc-500" />
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Neural Link Synchronized</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 flex items-center justify-between pt-5 border-t border-white/[0.03] mt-4">
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(dept); }}
            className="p-3 bg-zinc-950 hover:bg-blue-600 hover:text-white text-zinc-500 rounded-2xl border border-white/[0.02] transition-all active:scale-90"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(dept.id); }}
            className="p-3 bg-zinc-950 hover:bg-rose-600 hover:text-white text-zinc-500 rounded-2xl border border-white/[0.02] transition-all active:scale-90"
          >
            <Trash2 size={14} />
          </button>
        </div>
        
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
          isSelected ? 'text-blue-400' : 'text-zinc-600 group-hover:text-blue-500'
        }`}>
          <span className={isSelected ? 'animate-pulse' : ''}>
            {isSelected ? 'Inspecting' : 'Details'}
          </span>
          <ChevronRight size={14} strokeWidth={3} className={`transition-transform duration-500 ${
            isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'
          }`} />
        </div>
      </div>

      {/* Glassy Static Overlay for Non-Selected Cards */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
      )}
    </motion.div>
  );
}