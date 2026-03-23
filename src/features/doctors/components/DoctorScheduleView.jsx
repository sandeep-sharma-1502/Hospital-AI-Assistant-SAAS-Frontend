import { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, Edit2, Trash2, Loader2, Plus, AlertCircle } from "lucide-react";
import { getDoctorSchedules, deleteDoctorSchedule } from "../services/doctorApi";
import toast from "react-hot-toast";

const formatTime = (minutes) => {
  if (minutes === null || minutes === undefined) return "--:--";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
};

export default function DoctorScheduleView({ doctorId, onOpenModal, onEditClick }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDoctorSchedules(doctorId);
      setSchedules(data.data || data);
    } catch (err) {
      toast.error("Failed to load roster");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent Action: Remove this schedule entry?")) return;
    try {
      await deleteDoctorSchedule(id); 
      toast.success("Entry removed from roster");
      fetchSchedules();
    } catch (err) {
      toast.error("Registry update failed");
    }
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h4 className="text-xl font-black tracking-tight text-white uppercase">Weekly Roster</h4>
          <p className="text-[10px] text-blue-500 uppercase font-black tracking-[0.3em] mt-1.5 italic">Clinical Operation Hours</p>
        </div>
        <button 
          onClick={() => onOpenModal()} 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95 uppercase tracking-widest"
        >
          <Plus size={14} strokeWidth={3} />
          Add Shift
        </button>
      </div>

      {/* Schedule List */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Syncing Roster...</p>
          </div>
        ) : days.map((day, index) => {
          const dayData = schedules.find(s => s.dayOfWeek === index);
          return (
            <div 
              key={day} 
              className={`group flex items-center justify-between p-4 rounded-[24px] border transition-all duration-300 ${
                dayData 
                ? "bg-zinc-900/40 border-white/[0.04] hover:border-blue-500/30 shadow-xl" 
                : "bg-transparent border-dashed border-white/[0.05] opacity-40 hover:opacity-60"
              }`}
            >
              <div className="flex items-center gap-5">
                {/* Day Indicator */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[10px] font-black shadow-inner transition-colors ${
                  dayData 
                  ? "bg-blue-600 text-white" 
                  : "bg-zinc-800 text-zinc-500"
                }`}>
                  {day.substring(0, 3).toUpperCase()}
                </div>
                
                <div>
                  <span className={`text-sm font-black tracking-tight ${dayData ? "text-white" : "text-zinc-500"}`}>
                    {day}
                  </span>
                  {!dayData && (
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mt-0.5">Off Duty</p>
                  )}
                </div>
              </div>

              {dayData ? (
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Duty Cycle</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-blue-500" />
                      <p className="text-sm font-black text-white tabular-nums">
                        {formatTime(dayData.startTime)} <span className="text-zinc-600 mx-1">—</span> {formatTime(dayData.endTime)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Row Actions */}
                  <div className="flex items-center gap-2 border-l border-white/[0.05] pl-6 h-10 transition-all">
                    <button 
                      onClick={() => onEditClick(dayData)} 
                      className="p-2.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                      title="Edit Shift"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(dayData.id)} 
                      className="p-2.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Remove Shift"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-zinc-700 pr-4">
                  <AlertCircle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Unassigned</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      {!loading && schedules.length > 0 && (
        <div className="px-4 py-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-3">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
           <p className="text-[9px] text-blue-500/80 font-bold uppercase tracking-widest">
             Roster is live and synced with the patient booking engine.
           </p>
        </div>
      )}
    </div>
  );
}