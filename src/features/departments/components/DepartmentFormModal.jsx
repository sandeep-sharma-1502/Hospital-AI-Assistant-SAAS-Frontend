import React from 'react';
import { X, ShieldCheck, Zap, Activity, Cpu, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepartmentFormModal({ isOpen, onClose, formData, setFormData, onSubmit, isEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop with Heavy Blur */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#0c0c0e] border border-white/[0.05] rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-t-4 border-t-blue-600"
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-blue-500/50 blur-xl opacity-50" />

        <div className="p-10">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500 border border-blue-500/20">
                  <Terminal size={18} />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">
                    {isEditing ? 'Modify Wing' : 'Provision Wing'}
                  </h2>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1.5 italic">Protocol: Registry Update</p>
               </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all text-zinc-500 hover:text-white border border-white/[0.03]"
            >
              <X size={20}/>
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
            {/* Input Groups */}
            <div className="grid grid-cols-1 gap-6">
              
              {/* Wing Name */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Designation Name</label>
                  <Cpu size={12} className="text-zinc-700" />
                </div>
                <input 
                  className="w-full h-14 bg-zinc-950/50 border border-white/[0.05] rounded-2xl px-5 text-sm font-bold text-white focus:border-blue-500 focus:bg-zinc-950 outline-none transition-all placeholder:text-zinc-800"
                  placeholder="e.g., Cardiology Core"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              {/* Wing Code & Status Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Wing ID Code</label>
                  <input 
                    className="w-full h-14 bg-zinc-950/50 border border-white/[0.05] rounded-2xl px-5 text-[13px] font-black font-mono text-blue-500 uppercase tracking-widest focus:border-blue-500 outline-none transition-all"
                    placeholder="CRD-01"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                  />
                </div>

                {/* Custom Operational Toggle */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">System Status</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`w-full h-14 rounded-2xl border flex items-center justify-center gap-2 transition-all duration-500 ${
                      formData.isActive 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-500 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]'
                    }`}
                  >
                    <Activity size={14} className={formData.isActive ? 'animate-pulse' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {formData.isActive ? 'Active' : 'Standby'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Description / Briefing */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 text-left block">Wing Description / Operational Brief</label>
                <textarea 
                  className="w-full bg-zinc-950/50 border border-white/[0.05] rounded-[28px] p-5 text-sm font-medium text-zinc-400 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none leading-relaxed italic"
                  placeholder="Enter high-level briefing for this operational unit..."
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 h-16 rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] text-zinc-500 border border-white/[0.05] hover:bg-zinc-900 hover:text-white transition-all active:scale-95"
              >
                Abort
              </button>
              <button 
                type="submit" 
                className="flex-[2] h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(37,99,235,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                <Zap size={16} strokeWidth={3} className="group-hover:text-yellow-400 transition-colors" />
                {isEditing ? 'Save Configuration' : 'Deploy Wing'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}