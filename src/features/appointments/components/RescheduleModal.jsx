import { useState, useEffect } from "react";
import { fetchAvailableSlots } from "../services/appointmentApi";
import { Calendar, Clock, X, Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Time Formatter Helper (Minutes to 10:30 AM)
const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${m < 10 ? '0' : ''}${m} ${ampm}`;
};

export default function RescheduleModal({
  appointment,
  doctorId,
  onClose,
  onConfirm
}) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-load slots when date changes
  useEffect(() => {
    if (date) {
      const loadSlots = async () => {
        setLoading(true);
        try {
          const data = await fetchAvailableSlots(doctorId, date);
          setSlots(data);
        } catch (error) {
          console.error("Slot fetch error:", error);
        } finally {
          setLoading(false);
        }
      };
      loadSlots();
    }
  }, [date, doctorId]);

  return (
    <div className="bg-[#0c0c0e] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl max-w-md w-full relative font-sans">
      {/* Header */}
      <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
            Reschedule <span className="text-blue-500">Node</span>
          </h2>
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">
            Patient: {appointment?.patient?.name || "Unknown"}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Input Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 flex items-center gap-2">
            <Calendar size={12} className="text-blue-500" /> Select New Vector Date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold"
          />
        </div>

        {/* Slots Grid */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <Clock size={12} className="text-blue-500" /> Available Time Slots
            </label>
            {loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {slots.length > 0 ? (
                slots.map((slot, idx) => (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onConfirm(appointment.id, slot.id)}
                    className="group relative flex items-center justify-between p-4 bg-zinc-950 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left"
                  >
                    <span className="text-xs font-black text-zinc-300 group-hover:text-blue-400 tabular-nums uppercase italic">
                      {formatTime(slot.startTime)}
                    </span>
                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))
              ) : !loading && date ? (
                <div className="col-span-2 py-8 text-center border border-dashed border-white/5 rounded-3xl">
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No Slots Detected</p>
                </div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer System Notice */}
      <div className="p-4 bg-zinc-950/50 border-t border-white/[0.03] text-center">
        <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em] italic">
          Manual Override Registry // MedFlow OS
        </p>
      </div>
    </div>
  );
}