import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  AlertCircle,
  Plus,
  X,
  Globe,
  Activity,
  User,
  MoreHorizontal,
  CalendarClock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { useAppointments } from "../../features/appointments/hooks/useAppointments";
import BookAppointmentModal from "../../features/appointments/components/BookAppointmentModal";
import AppointmentDetailsModal from "../../features/appointments/components/AppointmentDetailsModal";
import RescheduleModal from "../../features/appointments/components/RescheduleModal";
import { fetchDoctors } from "../../features/doctors/services/doctorApi";

/* ---------------- SHIMMER LOADER ---------------- */
const ShimmerRow = () => (
  <tr className="animate-pulse border-b border-slate-100 dark:border-white/[0.02]">
    <td className="px-8 py-5"><div className="h-10 w-10 bg-slate-100 dark:bg-white/[0.05] rounded-xl" /></td>
    <td className="px-8 py-5"><div className="space-y-2"><div className="h-3 w-32 bg-slate-100 dark:bg-white/[0.05] rounded" /><div className="h-2 w-20 bg-slate-100 dark:bg-white/[0.05] rounded" /></div></td>
    <td className="px-8 py-5"><div className="h-4 w-28 bg-slate-100 dark:bg-white/[0.05] rounded" /></td>
    <td className="px-8 py-5"><div className="h-4 w-24 bg-slate-100 dark:bg-white/[0.05] rounded" /></td>
    <td className="px-8 py-5"><div className="h-6 w-20 bg-slate-100 dark:bg-white/[0.05] rounded-lg" /></td>
    <td className="px-8 py-5"><div className="h-8 w-8 bg-slate-100 dark:bg-white/[0.05] rounded-lg" /></td>
  </tr>
);

export default function AppointmentsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);

  const { appointments, meta, loading, error, cancel, updateStatus, reschedule, reload } = useAppointments({
     status: filter,
     page,
     limit: 10
  });

  const formatTime = (minutes) => {
    if (minutes == null) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hrs >= 12 ? "PM" : "AM";
    const formattedHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const formattedMins = mins.toString().padStart(2, "0");
    return `${formattedHrs}:${formattedMins} ${ampm}`;
  };

  const openBooking = async () => {
    setIsFetchingDoctors(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      setIsBookingOpen(true);
    } catch {
      toast.error("Could not load doctor registry");
    } finally {
      setIsFetchingDoctors(false);
    }
  };

  useEffect(() => {
    const handler = () => {
      setIsBookingOpen(false);
      reload();
    };
    window.addEventListener("appointment-booked", handler);
    return () => window.removeEventListener("appointment-booked", handler);
  }, [reload]);

  const filteredData = appointments.filter((item) => {
    // Only search filter here since status is handled by backend
    const patientName = item.patient?.name?.toLowerCase() || "";
    const doctorName = item.doctor?.name?.toLowerCase() || "";
    return patientName.includes(search.toLowerCase()) || doctorName.includes(search.toLowerCase());
  });

  const handleFilterChange = (status) => {
    setFilter(status);
    setPage(1); // Reset to page 1 on filter change
  };

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="text-center p-12 bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/[0.08] rounded-[40px] shadow-2xl">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase italic tracking-tighter">System Link Error</h3>
          <p className="text-slate-500 dark:text-zinc-500 text-sm max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 dark:bg-[#09090b] min-h-screen font-sans text-slate-800 dark:text-zinc-100 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#121214', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', fontWeight: 'bold' }}} />

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-zinc-500 italic">MedFlow Operational Terminal</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase leading-none">
            Visits <span className="text-slate-200 dark:text-zinc-800">/</span> Registry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search Index..."
              className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-6 text-xs w-72 focus:outline-none focus:border-blue-500/40 transition-all placeholder:text-slate-400 dark:text-zinc-700 font-bold uppercase tracking-widest"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={openBooking}
            disabled={isFetchingDoctors}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
          >
            {isFetchingDoctors ? <Clock className="animate-spin" size={16}/> : <Plus size={16} strokeWidth={3}/>}
            Deploy Visit
          </button>
        </div>
      </div>

      {/* ---------------- FILTERS ---------------- */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex gap-2">
          {["All", "Confirmed", "Pending", "Cancelled"].map(status => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                filter === status
                  ? "bg-slate-900 text-white dark:bg-white/[0.08] border-slate-200 dark:border-white/10 shadow-lg"
                  : "bg-transparent text-slate-500 dark:text-zinc-600 border-transparent hover:text-slate-600 dark:text-zinc-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-black text-slate-400 dark:text-zinc-700 uppercase tracking-widest italic">
          Total Entries: {meta?.total || 0}
        </div>
      </div>

      {/* ---------------- HIGH-DENSITY TABLE ---------------- */}
      <div className="bg-white dark:bg-[#0c0c0e] border border-slate-100 dark:border-white/[0.04] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01]">
                {["Patient Matrix", "Specialist Unit", "Consultation", "Time Vector", "Integrity", "Ops"].map((head) => (
                  <th key={head} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-zinc-600 italic">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                <><ShimmerRow /><ShimmerRow /><ShimmerRow /><ShimmerRow /></>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredData.map((apt) => (
                    <motion.tr
                      key={apt.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="hover:bg-blue-600/[0.02] transition-colors group"
                    >
                      {/* PATIENT INFO */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-[18px] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:text-white group-hover:border-blue-500/50 transition-all">
                            {apt.patient?.name?.substring(0, 2).toUpperCase() || "NA"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-slate-800 dark:text-zinc-200 group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">
                              {apt.patient?.name}
                            </span>
                            <span className="text-[9px] font-black text-slate-500 dark:text-zinc-600 tracking-widest uppercase mt-0.5">
                              ID // {apt.patient?.patientCode || "NULL"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* DOCTOR INFO */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 text-[13px] font-bold uppercase tracking-tight italic">
                            <User size={12} className="text-slate-400 dark:text-zinc-700" />
                            {apt.doctor?.name}
                          </div>
                          <span className="text-[9px] font-black text-blue-500/50 tracking-[0.15em] uppercase mt-1">
                            {apt.doctor?.specialization || "General Core"}
                          </span>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl border transition-colors ${
                            apt.consultationType === 'IN_PERSON' 
                            ? 'bg-blue-500/5 border-blue-500/10 text-blue-500' 
                            : 'bg-purple-500/5 border-purple-500/10 text-purple-500'
                          }`}>
                            {apt.consultationType === 'IN_PERSON' ? <Stethoscope size={14} /> : <Globe size={14} />}
                          </div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest italic group-hover:text-slate-700 dark:text-zinc-300">
                            {apt.consultationType?.replace('_', ' ') || 'STANDARD'}
                          </span>
                        </div>
                      </td>

                      {/* TIME SLOT */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-200 font-black text-[13px] tabular-nums italic group-hover:text-blue-400 transition-colors">
                            <Clock size={12} className="opacity-40" />
                            {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                          </div>
                          <span className="text-[9px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-widest mt-1">
                            {new Date(apt.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                            : apt.status === "PENDING"
                            ? "bg-amber-500/5 text-amber-500 border-amber-500/10"
                            : "bg-rose-500/5 text-rose-500 border-rose-500/10"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${apt.status === "CONFIRMED" ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                          {apt.status}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {apt.status !== "CANCELLED" && (
                            <button
                              onClick={() => { if (window.confirm("Abort this visit?")) cancel(apt.id); }}
                              className="p-3 bg-slate-50 dark:bg-zinc-950 hover:bg-rose-600/20 border border-slate-200 dark:border-white/5 hover:border-rose-500/50 text-slate-500 dark:text-zinc-600 hover:text-rose-500 rounded-2xl transition-all active:scale-90"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          )}
                          <button 
                            onClick={() => setRescheduleData(apt)}
                            className="p-3 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-600 hover:text-slate-900 dark:text-white rounded-2xl transition-all"
                            title="Reschedule Appointment"
                          >
                             <CalendarClock size={14} />
                          </button>
                          <button 
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-3 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-600 hover:text-slate-900 dark:text-white rounded-2xl transition-all"
                          >
                             <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredData.length === 0 && (
          <div className="py-32 text-center bg-slate-50 dark:bg-zinc-950/20">
            <CalendarIcon className="mx-auto opacity-5 mb-6 text-slate-900 dark:text-white" size={80} />
            <p className="text-slate-400 dark:text-zinc-700 font-black uppercase tracking-[0.5em] text-[10px]">Zero Matrix Matches</p>
          </div>
        )}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {meta?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 relative z-10">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:text-white disabled:opacity-30 transition-all"
          >
            Prev
          </button>
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-600">
            Page {page} of {meta.totalPages}
          </span>
          <button 
            disabled={page === meta.totalPages}
            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:text-white disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* FOOTER METADATA */}
      <div className="mt-8 flex justify-between items-center px-4">
         <span className="text-[8px] font-black text-slate-200 dark:text-zinc-800 uppercase tracking-[0.6em] italic">Deep Space Healthcare v.4.0.2</span>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="text-[8px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-widest">Database Linked</span></div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> <span className="text-[8px] font-black text-slate-500 dark:text-zinc-600 uppercase tracking-widest">AI Sync Active</span></div>
         </div>
      </div>

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xl bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-[48px] shadow-[0_0_100px_rgba(37,99,235,0.1)] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
              <div className="p-2">
                <BookAppointmentModal
                  doctors={doctors}
                  onClose={() => { setIsBookingOpen(false); reload(); }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* DETAILS / SETTINGS MODAL */}
      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdateStatus={updateStatus}
      />

      {/* RESCHEDULE MODAL */}
      <RescheduleModal
        isOpen={!!rescheduleData}
        onClose={() => setRescheduleData(null)}
        appointment={rescheduleData}
        onReschedule={reschedule}
      />
    </div>
  );
}