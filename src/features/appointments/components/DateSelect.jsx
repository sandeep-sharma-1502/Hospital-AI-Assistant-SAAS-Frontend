import React from "react";
import { Calendar, ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function DateSelect({ value, onChange, onNext }) {
  // Get today's date for 'min' attribute to prevent past bookings
  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="relative group">
        {/* Label and Icon */}
        <div className="flex items-center gap-2 mb-3 ml-1">
          <Calendar size={14} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">
            Temporal Vector Selection
          </span>
        </div>

        {/* The Input Wrapper */}
        <div className="relative group">
          <input
            type="date"
            min={today}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-5 text-sm font-bold text-white 
                       focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 
                       transition-all appearance-none cursor-pointer group-hover:bg-zinc-900/50"
          />
          {/* Custom Calendar Icon Overlay (since default is often hidden in dark themes) */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-blue-500 transition-colors">
            <Calendar size={18} />
          </div>
        </div>
      </div>

      {/* System Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed font-medium text-zinc-400 uppercase tracking-tight">
          System will filter available specialist slots based on the selected <span className="text-blue-400 font-black italic">Date Vector</span>. Past nodes are automatically restricted.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onNext}
        disabled={!value}
        className={`group relative w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all overflow-hidden
          ${value 
            ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 active:scale-[0.98] hover:bg-blue-500" 
            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2 italic">
          Map Available Slots <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
        {/* Subtle Shine Effect on Hover */}
        {value && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        )}
      </button>

      {/* Footer Branding */}
      <div className="text-center">
        <span className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.6em] italic">
          Temporal Registry // Core 4.0
        </span>
      </div>
    </motion.div>
  );
}