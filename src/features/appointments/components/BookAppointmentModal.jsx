import { useBookAppointment } from "../hooks/useBookAppointment";
import DoctorSelect from "./DoctorSelect";
import DateSelect from "./DateSelect";
import SlotList from "./SlotList";
import PatientSearchSelect from "../../patients/components/PatientSearchSelect";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ChevronLeft, Activity, User, Calendar, Clock } from "lucide-react";

export default function BookAppointmentModal({ doctors, onClose }) {
  const booking = useBookAppointment();

  const steps = [
    { id: 1, icon: <User size={12} />, label: "Doctor" },
    { id: 2, icon: <Calendar size={12} />, label: "Date" },
    { id: 3, icon: <Clock size={12} />, label: "Slot" },
    { id: 4, icon: <Activity size={12} />, label: "Patient" },
  ];

  // Step 4 expand width but LOCK height to prevent overflow
  const modalConfig = booking.step === 4 ? "max-w-5xl h-[650px]" : "max-w-xl h-[600px]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        layout
        className={`bg-[#0c0c0e] border border-white/10 rounded-[32px] w-full ${modalConfig} transition-all duration-500 shadow-2xl relative flex flex-col overflow-hidden`}
      >
        
        {/* HEADER: Fixed Height */}
        <div className="h-16 flex border-b border-white/[0.03] bg-white/[0.01] shrink-0">
          {steps.map((s) => (
            <div key={s.id} className={`flex-1 flex items-center justify-center gap-2 ${booking.step >= s.id ? "opacity-100" : "opacity-20"}`}>
              <div className={`p-1.5 rounded-lg ${booking.step === s.id ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-zinc-800"}`}>
                {s.icon}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-300 hidden md:block">{s.label}</span>
            </div>
          ))}
        </div>

        {/* MAIN VIEWPORT: Scrollable content only */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-gradient-to-b from-transparent to-white/[0.01]">
          {booking.step > 1 && booking.step < 6 && (
            <button 
              onClick={() => booking.setStep(booking.step - 1)}
              className="flex items-center gap-1 text-[8px] font-black uppercase text-zinc-500 hover:text-blue-500 mb-6 transition-all"
            >
              <ChevronLeft size={12} /> Back to Terminal
            </button>
          )}

          <AnimatePresence mode="wait">
            {booking.step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white text-center">Select <span className="text-blue-500">Physician</span></h2>
                <DoctorSelect doctors={doctors} onSelect={(doc) => { booking.setDoctor(doc); booking.setStep(2); }} />
              </motion.div>
            )}

            {booking.step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white text-center">Choose <span className="text-blue-500">Timeline</span></h2>
                <DateSelect value={booking.date} onChange={booking.setDate} onNext={booking.loadSlots} />
              </motion.div>
            )}

            {booking.step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-2xl font-black italic uppercase text-white text-center">Mapping <span className="text-blue-500">Slots</span></h2>
                <SlotList slots={booking.slots} loading={booking.loading} onSelect={(slot) => { booking.setSlot(slot); booking.setStep(4); }} />
              </motion.div>
            )}

            {booking.step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-black italic uppercase text-white">Assign <span className="text-blue-500">Patient</span></h2>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Identity Verification Node</p>
                </div>
                <div className="bg-zinc-950/40 border border-white/[0.03] rounded-[32px] p-2">
                  <PatientSearchSelect onSelect={(p) => booking.confirmBooking({ patientId: p.id })} />
                </div>
              </motion.div>
            )}

            {booking.step === 6 && (
              <motion.div key="s6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black italic uppercase text-white">Node Registered!</h3>
                <button onClick={onClose} className="w-full max-w-xs mx-auto bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200">Close Terminal</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER: Fixed at Bottom */}
        {booking.step !== 6 && (
          <div className="h-16 px-8 border-t border-white/[0.03] bg-zinc-950/50 flex items-center justify-between shrink-0">
            <p className="text-[7px] font-black text-zinc-800 uppercase tracking-[0.6em] italic">MedFlow OS // Terminal v4</p>
            <button onClick={onClose} className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-600 hover:text-rose-500 transition-colors">
              <X size={14} /> Abort Operation
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}