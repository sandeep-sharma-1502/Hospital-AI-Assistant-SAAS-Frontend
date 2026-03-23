import React from "react";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Helper to format minutes to 10:30 AM
const formatTime = (minutes) => {
  if (typeof minutes !== 'number') return minutes; // Fallback if already formatted
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${m < 10 ? '0' : ''}${m} ${ampm}`;
};

export default function SlotList({ slots = [], onSelect, loading }) {
  
  // Shimmer Loader for High-Density feel
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-white/[0.03] border border-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[32px] bg-zinc-950/20">
        <AlertCircle size={24} className="text-zinc-800 mb-3" />
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">
          Zero Slots Available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 ml-1">
        <Clock size={14} className="text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">
          Available Time Vectors
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {slots.map((slot, idx) => {
          const startTimeRaw = slot.startTime || slot.start_time;
          const isEvening = startTimeRaw >= 720; // After 12 PM

          return (
            <motion.button
              key={slot.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              disabled={loading}
              onClick={() => onSelect(slot)}
              className="group relative p-4 bg-zinc-950 border border-white/5 rounded-2xl 
                         hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-200 group-hover:text-emerald-400 tabular-nums italic transition-colors">
                    {formatTime(startTimeRaw)}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
                    {isEvening ? "Evening Session" : "Morning Session"}
                  </span>
                </div>
                <CheckCircle2 size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Hover Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/[0.01] to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </div>

      <div className="text-center pt-2">
         <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em] italic">
           All slots are synced with specialist local time
         </p>
      </div>
    </div>
  );
}