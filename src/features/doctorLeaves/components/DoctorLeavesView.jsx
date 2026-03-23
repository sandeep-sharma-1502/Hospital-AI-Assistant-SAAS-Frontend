import { useEffect, useState, useCallback } from "react";
import { Coffee, Trash2, Calendar as CalIcon, Loader2, Plus, ArrowRight } from "lucide-react";
import { getDoctorLeaves, deleteDoctorLeave } from "../services/doctorLeaveApi";
import toast from "react-hot-toast";

export default function DoctorLeavesView({ doctorId, onOpenModal }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDoctorLeaves(doctorId);
      setLeaves(data.data || data);
    } catch (err) {
      console.error("Absence Registry Sync Error", err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleDelete = async (id) => {
    if (!window.confirm("System Action: Revoke this leave application?")) return;
    try {
      await deleteDoctorLeave(id);
      toast.success("Leave record purged");
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update registry");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-600">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h4 className="text-xl font-black tracking-tight text-white uppercase italic">Leave Management</h4>
          <p className="text-[10px] text-orange-500 uppercase font-black tracking-[0.3em] mt-1.5">Staff Absence & Vacations</p>
        </div>
        <button 
          onClick={onOpenModal} 
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.15)] active:scale-95 uppercase tracking-widest"
        >
          <Plus size={14} strokeWidth={3} />
          Register Leave
        </button>
      </div>

      {/* Leaves List */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-orange-600" size={32} />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Fetching Records...</p>
          </div>
        ) : leaves.length > 0 ? (
          leaves.map((leave) => (
            <div 
              key={leave.id} 
              className="group flex items-center justify-between p-5 bg-zinc-900/40 border border-white/[0.03] rounded-[28px] hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all duration-300 shadow-xl"
            >
              <div className="flex gap-5">
                {/* Status Icon */}
                <div className="p-3.5 bg-zinc-950 rounded-2xl text-orange-500 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-white/[0.02] h-fit">
                  <Coffee size={20} strokeWidth={2.5} />
                </div>
                
                <div>
                  {/* Date Range */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white tabular-nums tracking-tight">
                      {new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                    <ArrowRight size={12} className="text-zinc-700" />
                    <span className="text-sm font-black text-white tabular-nums tracking-tight">
                      {new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-2 py-0.5 bg-orange-500/10 rounded-md text-[9px] font-black uppercase text-orange-500 border border-orange-500/10 italic tracking-tighter">
                      {leave.leaveType || "Standard"}
                    </span>
                    {leave.description && (
                      <p className="text-[10px] text-zinc-500 font-medium italic truncate max-w-[200px]">
                        "{leave.description}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleDelete(leave.id)} 
                className="p-3 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title="Cancel Leave"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 bg-zinc-900/10 border-2 border-dashed border-white/[0.02] rounded-[40px] flex flex-col items-center justify-center gap-4 group hover:border-white/[0.05] transition-colors">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-800 group-hover:text-zinc-700 transition-colors shadow-inner">
               <Coffee size={32} strokeWidth={1} />
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">No Recorded Absences</p>
                <p className="text-[9px] font-bold text-zinc-800 uppercase tracking-tighter mt-1 italic">Staff is currently active and fully operational</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {!loading && leaves.length > 0 && (
        <div className="px-5 py-4 bg-zinc-900/40 rounded-3xl border border-white/[0.03] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CalIcon size={14} className="text-zinc-600" />
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                Total Planned Absences: <span className="text-orange-500 ml-1">{leaves.length} Entries</span>
              </p>
           </div>
           <span className="text-[8px] font-black text-zinc-800 uppercase italic">MedFlow OS Registry v2.0</span>
        </div>
      )}
    </div>
  );
}