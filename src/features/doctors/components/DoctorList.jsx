import { Search, UserCircle, Activity, ChevronRight } from "lucide-react";

export default function DoctorList({ onSelect, selectedId, doctors = [], onSearchChange }) {
  return (
    <div className="flex-1 flex flex-col bg-[#09090b] border border-white/[0.04] rounded-[36px] overflow-hidden shadow-2xl">
      
      {/* Premium Search Header */}
      <div className="p-5 border-b border-white/[0.03] bg-zinc-900/20 backdrop-blur-md">
        <div className="relative group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" 
            size={14} 
          />
          <input 
            type="text" 
            placeholder="Search Medical Staff..." 
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-zinc-900/50 border border-white/[0.05] rounded-[18px] text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-blue-500/40 focus:bg-zinc-900 transition-all placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* List Area - High Density */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc)}
              className={`w-full group flex items-center gap-4 p-3.5 rounded-[22px] transition-all duration-300 relative overflow-hidden ${
                selectedId === doc.id 
                ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] scale-[1.02] z-10" 
                : "hover:bg-white/[0.03] text-zinc-400 hover:text-white"
              }`}
            >
              {/* Profile Avatar / Initial */}
              <div className={`w-11 h-11 min-w-[44px] rounded-[14px] flex items-center justify-center font-black text-xs shadow-inner transition-colors duration-500 ${
                selectedId === doc.id 
                ? "bg-white/20" 
                : "bg-zinc-900 text-blue-500 border border-white/[0.03] group-hover:border-blue-500/30"
              }`}>
                {doc.name.charAt(0).toUpperCase()}
              </div>

              {/* Info Area */}
              <div className="text-left overflow-hidden flex-1">
                <p className={`font-black text-[12px] tracking-tight truncate leading-tight ${selectedId === doc.id ? "text-white" : "text-zinc-200"}`}>
                  {doc.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    <Activity size={10} className={selectedId === doc.id ? "text-white/50" : "text-blue-600"} />
                    <p className={`text-[9px] font-black uppercase tracking-widest truncate ${
                        selectedId === doc.id ? "text-white/60" : "text-zinc-500"
                    }`}>
                        {doc.specialization || "General Physician"}
                    </p>
                </div>
              </div>

              {/* Selector Indicator */}
              {selectedId === doc.id && (
                <div className="absolute right-4 animate-in fade-in slide-in-from-left-2 duration-300">
                    <ChevronRight size={16} strokeWidth={3} />
                </div>
              )}
            </button>
          ))
        ) : (
            <div className="py-20 flex flex-col items-center justify-center opacity-20">
                <UserCircle size={40} strokeWidth={1} className="text-zinc-500" />
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em]">Registry Empty</p>
            </div>
        )}
      </div>
    </div>
  );
}