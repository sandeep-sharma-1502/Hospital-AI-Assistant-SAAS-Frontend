import React from "react";
import { User, ChevronRight, Star, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorSelect({ doctors, onSelect }) {
  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex items-center gap-2 mb-4 ml-1">
        <Briefcase size={14} className="text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">
          Specialist Registry Index
        </span>
      </div>

      {doctors.map((doc, idx) => {
        // Safe check for name
        const displayName = typeof doc.name === 'object' ? doc.name.name : doc.name;
        
        return (
          <motion.button
            key={doc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(doc)}
            className="w-full group relative flex items-center gap-4 p-4 bg-zinc-950 border border-white/5 rounded-[24px] 
                       hover:border-blue-500/40 hover:bg-blue-600/[0.03] transition-all text-left overflow-hidden"
          >
            {/* 1. DOCTOR AVATAR / INITIALS */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 
                            flex items-center justify-center text-xs font-black text-white group-hover:scale-110 transition-transform">
                {displayName?.charAt(0) || "D"}
              </div>
              {doc.isActive && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0c0c0e] rounded-full" />
              )}
            </div>

            {/* 2. DOCTOR INFO */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-[13px] text-zinc-100 group-hover:text-blue-400 transition-colors uppercase italic tracking-tight truncate">
                  Dr. {displayName}
                </p>
                {doc.rating > 0 && (
                  <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-md">
                    <Star size={8} className="text-amber-500 fill-amber-500" />
                    <span className="text-[8px] font-black text-zinc-400 tabular-nums">{doc.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest">
                  {doc.department?.name || doc.specialization || "General Core"}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="text-[9px] font-bold text-zinc-600 uppercase">
                  EXP: {doc.experienceYears || '0'} YRS
                </span>
              </div>
            </div>

            {/* 3. INTERACTIVE ELEMENT */}
            <div className="p-2 rounded-xl bg-white/[0.02] group-hover:bg-blue-500/10 transition-colors text-zinc-800 group-hover:text-blue-500">
              <ChevronRight size={16} />
            </div>

            {/* Subtle Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/[0.02] to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        );
      })}

      {doctors.length === 0 && (
        <div className="py-10 text-center border border-dashed border-white/5 rounded-[32px]">
          <User className="mx-auto opacity-10 mb-2" size={32} />
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No Specialists Logged</p>
        </div>
      )}
    </div>
  );
}