import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Check, Loader2, Coffee, X, Calendar, Hash, MapPin, Monitor, ToggleRight, ToggleLeft } from "lucide-react";
import { createSchedule, updateSchedule, getDoctorSchedules } from "../services/doctorApi";
import toast from "react-hot-toast";

export default function ScheduleForm({ doctor, isOpen, onClose, onSuccess, editData = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  
  const [formData, setFormData] = useState({
    dayOfWeek: 1, startTime: "09:00", endTime: "17:00",
    lunchStart: "13:00", lunchEnd: "14:00", slotDuration: 15,
    maxPatients: 20, supportsOnline: false, allowBooking: true,
  });

  const toMin = (t) => { if (!t) return 0; const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const fromMin = (min) => {
    const h = Math.floor(min / 60).toString().padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const fetchSchedules = useCallback(async () => {
    if (!doctor?.id) return;
    setIsLoading(true);
    try {
      const res = await getDoctorSchedules(doctor.id);
      setDoctorSchedules(res.data || []);
    } catch (err) { toast.error("Sync Error"); } finally { setIsLoading(false); }
  }, [doctor?.id]);

  useEffect(() => { if (isOpen) fetchSchedules(); }, [isOpen, fetchSchedules]);

  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        dayOfWeek: editData.dayOfWeek,
        startTime: fromMin(editData.startTime),
        endTime: fromMin(editData.endTime),
        lunchStart: fromMin(editData.lunchStart),
        lunchEnd: fromMin(editData.lunchEnd),
        slotDuration: editData.slotDuration,
        maxPatients: editData.maxPatients,
        supportsOnline: editData.supportsOnline,
        allowBooking: editData.allowBooking ?? true,
      });
    } else {
      const existing = doctorSchedules.find(s => s.dayOfWeek === Number(formData.dayOfWeek));
      if (existing) {
        setFormData(prev => ({
          ...prev,
          startTime: fromMin(existing.startTime),
          endTime: fromMin(existing.endTime),
          lunchStart: fromMin(existing.lunchStart),
          lunchEnd: fromMin(existing.lunchEnd),
          slotDuration: existing.slotDuration,
          maxPatients: existing.maxPatients,
          supportsOnline: existing.supportsOnline,
          allowBooking: existing.allowBooking ?? true,
        }));
      }
    }
  }, [formData.dayOfWeek, doctorSchedules, editData, isOpen]);

  useEffect(() => {
    const totalMinutes = toMin(formData.endTime) - toMin(formData.startTime);
    const breakMinutes = toMin(formData.lunchEnd) - toMin(formData.lunchStart);
    const available = totalMinutes - breakMinutes;
    if (available > 0 && formData.slotDuration > 0) {
      const calculated = Math.floor(available / formData.slotDuration);
      if(calculated !== formData.maxPatients) {
        setFormData(prev => ({ ...prev, maxPatients: calculated }));
      }
    }
  }, [formData.startTime, formData.endTime, formData.lunchStart, formData.lunchEnd, formData.slotDuration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...formData,
      dayOfWeek: Number(formData.dayOfWeek),
      startTime: toMin(formData.startTime),
      endTime: toMin(formData.endTime),
      lunchStart: toMin(formData.lunchStart),
      lunchEnd: toMin(formData.lunchEnd),
    };

    try {
      const existing = editData || doctorSchedules.find(s => s.dayOfWeek === Number(formData.dayOfWeek));
      if (existing) {
        await updateSchedule(existing.id, payload);
        toast.success("Roster Updated");
      } else {
        await createSchedule(doctor.id, payload);
        toast.success("Roster Created");
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) { toast.error("Sync Error"); } finally { setIsSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop: Deeper dark blur */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-[110] p-4"
          >
            {/* Main Container: Deep Zinc with subtle border */}
            <div className="bg-[#09090b] border border-white/5 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header: Darker gradient with Teal accent */}
              <div className="px-6 pt-6 pb-4 border-b border-white/[0.03] flex justify-between items-center bg-zinc-900/50 shrink-0">
                <div className="flex items-center gap-4 text-white">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none tracking-tight">
                      {editData ? "Edit Roster Timing" : "Manage Roster"}
                    </h3>
                    <p className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] mt-1 font-black italic">Dr. {doctor?.name}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 bg-white/[0.03] hover:bg-rose-500/10 rounded-full text-zinc-500 hover:text-rose-500 transition-all">
                  <X size={20}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar bg-transparent">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} className="text-emerald-500" /> Working Day
                    </label>
                    <div className="grid grid-cols-7 gap-1.5">
                      {[1,2,3,4,5,6,7].map(d => (
                         <button
                           key={d} type="button"
                           disabled={!!editData}
                           onClick={() => setFormData({...formData, dayOfWeek: d})}
                           className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                             formData.dayOfWeek === d 
                             ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                             : 'bg-zinc-900/50 border-white/[0.03] text-zinc-600 hover:border-emerald-500/30'
                           } ${editData && formData.dayOfWeek !== d ? 'opacity-20 cursor-not-allowed' : ''}`}
                         >
                           {['','M','T','W','T','F','S','S'][d]}
                         </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase ml-1">Open</p>
                        <input type="time" className="w-full px-4 py-3 bg-zinc-900 border border-white/[0.05] rounded-2xl text-sm font-bold text-white focus:border-emerald-500/50 outline-none transition-all [color-scheme:dark]"
                          value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase ml-1">Close</p>
                        <input type="time" className="w-full px-4 py-3 bg-zinc-900 border border-white/[0.05] rounded-2xl text-sm font-bold text-white focus:border-emerald-500/50 outline-none transition-all [color-scheme:dark]"
                          value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Lunch Break: Subtle Amber Contrast */}
                  <div className="p-6 bg-amber-500/[0.02] rounded-[32px] border border-amber-500/10 space-y-4">
                    <div className="flex items-center gap-2 text-amber-500/60 font-black text-[10px] uppercase tracking-widest italic">
                      <Coffee size={14} /> Lunch Interval
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="time" className="w-full bg-zinc-900 border border-amber-500/10 rounded-xl p-3 text-xs font-bold text-amber-200/80 [color-scheme:dark]"
                        value={formData.lunchStart} onChange={e => setFormData({...formData, lunchStart: e.target.value})} />
                      <input type="time" className="w-full bg-zinc-900 border border-amber-500/10 rounded-xl p-3 text-xs font-bold text-amber-200/80 [color-scheme:dark]"
                        value={formData.lunchEnd} onChange={e => setFormData({...formData, lunchEnd: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Consulting Mode</label>
                    <div className="flex bg-zinc-900/80 p-1 rounded-2xl border border-white/[0.03]">
                      <button type="button" onClick={() => setFormData({...formData, supportsOnline: false})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${!formData.supportsOnline ? 'bg-zinc-800 shadow-inner text-emerald-400' : 'text-zinc-600'}`}>
                        <MapPin size={16} /> Clinic
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, supportsOnline: true})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${formData.supportsOnline ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-600'}`}>
                        <Monitor size={16} /> Online
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Consulting Time</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                      <input type="number" className="w-full pl-11 pr-16 py-3.5 bg-zinc-900 border border-white/[0.05] rounded-2xl text-sm font-bold text-white outline-none focus:border-emerald-500/30 transition-all"
                        value={formData.slotDuration} onChange={e => setFormData({...formData, slotDuration: e.target.value})} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-600 uppercase italic">Min</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Accepting Bookings</label>
                    <div className="flex bg-zinc-900/80 p-1 rounded-2xl border border-white/[0.03]">
                      <button type="button" onClick={() => setFormData({...formData, allowBooking: true})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${formData.allowBooking ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-600'}`}>
                        <ToggleRight size={16} /> Enabled
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, allowBooking: false})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${!formData.allowBooking ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'text-zinc-600'}`}>
                        <ToggleLeft size={16} /> Disabled
                      </button>
                    </div>
                  </div>

                  {/* Summary Box: High Tech Emerald Glow */}
                  <div className="p-4 bg-emerald-500/[0.03] border border-dashed border-emerald-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-xs">
                        {formData.maxPatients}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Capacity</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Slots / Cycle</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Button: Pure Modern Emerald */}
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-emerald-500/10 border border-emerald-400/20"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                    {editData ? "Execute Update" : "Deploy Roster"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}