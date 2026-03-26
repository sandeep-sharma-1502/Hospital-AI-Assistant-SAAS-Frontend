import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarClock, Activity } from "lucide-react";
import DateSelect from "./DateSelect";
import SlotList from "./SlotList";
import { fetchAvailableSlots } from "../services/appointmentApi";
import toast from "react-hot-toast";

export default function RescheduleModal({ isOpen, onClose, appointment, onReschedule }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && appointment) {
      setDate("");
      setSlots([]);
      setStep(1);
    }
  }, [isOpen, appointment]);

  const handleNext = async () => {
    if (!date || !appointment?.doctorId) return;
    
    setLoading(true);
    setStep(2);
    try {
      const data = await fetchAvailableSlots(appointment.doctorId, date);
      setSlots(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch slots");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = async (slot) => {
    if (isSubmitting) return;

    if (!window.confirm("Are you sure you want to reschedule to this time?")) return;

    setIsSubmitting(true);
    try {
      await onReschedule(appointment.id, slot.id);
      toast.success("Appointment Rescheduled Successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-center items-center p-4 bg-black/80 backdrop-blur-xl font-sans text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-[#09090b] border border-white/5 w-full max-w-lg rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="px-8 py-6 border-b border-white/[0.03] flex justify-between items-center bg-zinc-900/40 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Reschedule Visit</span>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="w-10 h-10 flex items-center justify-center bg-white/[0.03] hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all text-zinc-500">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar z-10">
           <div className="mb-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
             <CalendarClock size={24} className="mx-auto text-indigo-500 mb-2" />
             <h3 className="text-sm font-black uppercase italic tracking-widest text-indigo-400">Reassign Temporal Vector</h3>
             <p className="text-[10px] text-zinc-500 uppercase mt-1">For Patient // {appointment.patient?.name}</p>
           </div>

           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <DateSelect value={date} onChange={setDate} onNext={handleNext} />
               </motion.div>
             )}
             
             {step === 2 && (
               <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                 <button onClick={() => setStep(1)} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest mb-4 transition-colors">
                   ← Back to Date Selection
                 </button>
                 <SlotList loading={loading} slots={slots} onSelect={handleSlotSelect} />
                 {isSubmitting && (
                   <div className="mt-4 flex flex-col items-center">
                     <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                     <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-2 mt-2 italic">Confirming Assignment...</p>
                   </div>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}