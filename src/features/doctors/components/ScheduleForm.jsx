import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Check, Loader2 } from "lucide-react";
import { createSchedule } from "../services/doctorApi";
import toast from "react-hot-toast";

export default function ScheduleForm({ doctor }) {
  const [weekday, setWeekday] = useState(0);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  // Reset data and trigger "pop" animation when doctor switches
  useEffect(() => {
    if (doctor) {
      setWeekday(0);
      setStartTime("09:00");
      setEndTime("17:00");
    }
  }, [doctor?.id]);

  if (!doctor) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createSchedule(doctor.id, { 
        weekday: Number(weekday), 
        start_time: startTime, 
        end_time: endTime 
      });
      toast.success("Schedule Updated Successfully");
    } catch (err) { 
      toast.error("Failed to update schedule"); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        // Initial entrance only happens when the component first mounts (first doctor selected)
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card border border-border-subtle p-8 rounded-[32px] shadow-xl transition-colors duration-300"
      >
        <motion.div>
          <div className="flex items-center gap-2 mb-6 text-blue-500">
            <Clock size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Set Availability</span>
          </div>

          <h4 className="text-xl font-black text-text-primary mb-1">{doctor.name}</h4>
          <p className="text-text-secondary text-xs mb-8 font-medium uppercase tracking-tighter">
            {doctor.department} • Weekly Roster
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Work Day</label>
              <select 
                value={weekday} 
                onChange={(e) => setWeekday(e.target.value)}
                className="w-full bg-input-bg border border-border-subtle text-text-primary rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                  <option key={day} value={i}>{day}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Start</label>
                <input 
                  type="time" 
                  className="w-full bg-input-bg border border-border-subtle text-text-primary rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">End</label>
                <input 
                  type="time" 
                  className="w-full bg-input-bg border border-border-subtle text-text-primary rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20 mt-2"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}