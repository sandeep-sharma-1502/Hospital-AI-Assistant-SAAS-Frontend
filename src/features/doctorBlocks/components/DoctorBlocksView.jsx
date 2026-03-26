import { useEffect, useState, useCallback } from "react";
import { Ban, Trash2, Clock, Calendar as CalIcon, Loader2, Plus } from "lucide-react";
import { getDoctorBlocks, deleteDoctorBlock } from "../services/doctorBlockApi";
import toast from "react-hot-toast";

const formatTime = (minutes) => {
  if (minutes === null || minutes === undefined) return "--:--";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
};

export default function DoctorBlocksView({ doctorId, onOpenModal, onEditClick, refreshTrigger }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDoctorBlocks(doctorId);
      setBlocks(data.data || data);
    } catch (err) {
      console.error("Registry Sync Error", err);
    } finally {
      setLoading(false);
    }
  }, [doctorId, refreshTrigger]); // Added refreshTrigger

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Action Required: Remove this schedule restriction?")) return;
    try {
      await deleteDoctorBlock(id);
      toast.success("Restriction lifted");
      fetchBlocks();
    } catch (err) {
      toast.error("Failed to update registry");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-600">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h4 className="text-xl font-black tracking-tight text-white uppercase italic">Active Restrictions</h4>
          <p className="text-[10px] text-rose-500 uppercase font-black tracking-[0.3em] mt-1.5">Manual Schedule Overrides</p>
        </div>
        <button 
          onClick={onOpenModal} 
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.15)] active:scale-95 uppercase tracking-widest"
        >
          <Plus size={14} strokeWidth={3} />
          Create Block
        </button>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-600" size={32} />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Scanning Registry...</p>
          </div>
        ) : blocks.length > 0 ? (
          blocks.map((block) => (
            <div 
              key={block.id} 
              className="group flex items-center justify-between p-5 bg-zinc-900/40 border border-white/[0.03] rounded-[28px] hover:border-rose-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-zinc-950 rounded-2xl text-rose-500 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-white/[0.02]">
                  <Ban size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-black text-white tracking-tight uppercase italic">{block.blockType || "Temporary Block"}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                      <CalIcon size={12} className="text-zinc-700" />
                      {new Date(block.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                      <Clock size={12} className="text-zinc-700" />
                      {formatTime(block.startTime)} <span className="text-zinc-800">—</span> {formatTime(block.endTime)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEditClick(block)} 
                  className="p-3 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                  title="Modify Restriction"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button 
                  onClick={() => handleDelete(block.id)} 
                  className="p-3 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                  title="Lift Restriction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 bg-zinc-900/10 border-2 border-dashed border-white/[0.02] rounded-[40px] flex flex-col items-center justify-center gap-4 group hover:border-white/[0.05] transition-colors">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-800 group-hover:text-zinc-700 transition-colors shadow-inner">
               <Ban size={32} strokeWidth={1} />
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">No Active Restrictions</p>
                <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-tighter mt-1 italic">Schedule is currently fully operational</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Warning */}
      {!loading && blocks.length > 0 && (
        <div className="p-5 bg-rose-500/5 rounded-[24px] border border-rose-500/10 flex items-start gap-4">
           <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
               <CalIcon size={14} />
           </div>
           <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
             <span className="text-rose-500 font-black uppercase tracking-widest block mb-1">Impact Analysis:</span>
             Appointments falling within these time blocks will be automatically restricted. Please ensure alternative arrangements are communicated to affected patients.
           </p>
        </div>
      )}
    </div>
  );
}