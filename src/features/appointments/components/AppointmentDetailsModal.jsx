import { useState, useEffect } from "react";
import { X, User, Clock, Calendar, CheckCircle2, AlertCircle, Ban, ArrowRight, Activity, Smartphone, Mail, CreditCard, Stethoscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppointmentDetailsModal({ isOpen, onClose, appointment, onUpdateStatus }) {
  const [status, setStatus] = useState("PENDING");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === appointment.status) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(appointment.id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTime = (minutes) => {
    if (minutes == null) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hrs >= 12 ? "PM" : "AM";
    const formattedHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const formattedMins = mins.toString().padStart(2, "0");
    return `${formattedHrs}:${formattedMins} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-center items-center p-4 bg-black/80 backdrop-blur-xl font-sans text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-[#09090b] border border-white/5 w-full max-w-2xl rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative"
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-white/[0.03] flex justify-between items-center bg-zinc-900/40 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Visit Details</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/[0.03] hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all text-zinc-500">
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar z-10">
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            
            {/* Patient Identity */}
            <div className="flex-1 p-6 bg-zinc-900/40 border border-white/[0.03] rounded-[28px]">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-900 to-zinc-950 border border-white/10 flex items-center justify-center text-zinc-400">
                      <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight leading-none text-white uppercase italic">{appointment.patient?.name}</h3>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">ID // {appointment.patient?.patientCode}</p>
                  </div>
               </div>
               <div className="space-y-3 mt-6">
                 <div className="flex items-center gap-3 text-zinc-400">
                   <Smartphone size={14} className="text-zinc-600" />
                   <span className="text-xs font-bold tracking-wider">{appointment.patient?.phone || "NO PHONE REDACTED"}</span>
                 </div>
                 <div className="flex items-center gap-3 text-zinc-400">
                   <Mail size={14} className="text-zinc-600" />
                   <span className="text-xs font-bold tracking-wider">{appointment.patient?.email || "NO EMAIL PROVIDED"}</span>
                 </div>
               </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 p-6 bg-blue-900/5 border border-blue-500/10 rounded-[28px]">
               <h4 className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.2em] mb-4">Assigned Personnel</h4>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                      <Stethoscope size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-white uppercase italic">{appointment.doctor?.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">{appointment.doctor?.specialization}</p>
                  </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-white/[0.03]">
                 <div className="flex items-center gap-3 mb-2">
                   <Calendar size={14} className="text-zinc-600" />
                   <span className="text-xs font-black tracking-wider text-zinc-300">
                     {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                   </span>
                 </div>
                 <div className="flex items-center gap-3">
                   <Clock size={14} className="text-zinc-600" />
                   <span className="text-xs font-black tracking-wider text-blue-400">
                     {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                   </span>
                 </div>
               </div>
            </div>

          </div>

          {/* Status Configuration */}
          <div className="p-6 border border-white/[0.03] bg-zinc-900/40 rounded-[28px]">
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               Operational Status
               {isUpdating && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ml-2" />}
             </h4>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                 { id: "PENDING", label: "Pending", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500" },
                 { id: "CONFIRMED", label: "Confirmed", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500" },
                 { id: "COMPLETED", label: "Completed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500" },
                 { id: "NO_SHOW", label: "No Show", icon: Ban, color: "text-rose-500", bg: "bg-rose-500" }
               ].map(s => {
                  const isActive = status === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStatusChange(s.id)}
                      disabled={isUpdating || appointment.status === 'CANCELLED'}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all disabled:opacity-50 ${
                        isActive 
                        ? `border-${s.bg.split('-')[1]}-500/50 ${s.bg.replace('bg-', 'bg-')}/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]` 
                        : 'border-white/[0.03] bg-zinc-950 hover:bg-zinc-900 hover:border-white/10'
                      }`}
                    >
                      {isActive && <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${s.bg} shadow-[0_0_10px_currentcolor] animate-pulse`} />}
                      <s.icon size={20} className={`mb-2 ${isActive ? s.color : 'text-zinc-600'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
                    </button>
                  );
               })}
             </div>

             {appointment.status === 'CANCELLED' && (
               <div className="mt-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center">
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Appointment was manually aborted. Status locked.</p>
               </div>
             )}
          </div>

        </div>

      </motion.div>
    </div>
  );
}
