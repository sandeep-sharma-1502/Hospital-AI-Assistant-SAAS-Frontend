import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Mic, 
  Clock,
  Stethoscope,
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useAppointments } from "../../features/appointments/hooks/useAppointments";
import BookAppointmentModal from "../../features/appointments/components/BookAppointmentModal";
import { fetchDoctors } from "../../features/doctors/services/doctorApi";

// --- Shimmer Row Component ---
const ShimmerRow = () => (
  <tr className="animate-pulse border-b border-border-subtle">
    <td className="px-8 py-5"><div className="h-4 w-32 bg-border-subtle/50 rounded-md" /></td>
    <td className="px-8 py-5"><div className="h-4 w-24 bg-border-subtle/50 rounded-md" /></td>
    <td className="px-8 py-5"><div className="h-4 w-28 bg-border-subtle/50 rounded-md" /></td>
    <td className="px-8 py-5"><div className="h-6 w-20 bg-border-subtle/30 rounded-xl" /></td>
  </tr>
);

export default function AppointmentsPage() {
  // Added 'refresh' (or 'reload') from your hook to update list after booking
  const { appointments, loading, error, refresh } = useAppointments();
  console.log(appointments)

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);

  // -------------------------
  // Booking Logic
  // -------------------------
  const openBooking = async () => {
    setIsFetchingDoctors(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      setIsBookingOpen(true);
    } catch (err) {
      toast.error("Could not load doctors list");
    } finally {
      setIsFetchingDoctors(false);
    }
  };

  useEffect(() => {
  const handler = () => {
    setIsBookingOpen(false);
  };

  window.addEventListener("appointment-booked", handler);
  return () =>
    window.removeEventListener("appointment-booked", handler);
}, [isBookingOpen]);

  // -------------------------
  // Filtering Logic
  // -------------------------
  const filteredData = appointments.filter(item => {
    const normalizedStatus =
      item.status?.charAt(0).toUpperCase() +
      item.status?.slice(1);

    const matchesFilter =
      filter === 'All' || normalizedStatus === filter;

    const matchesSearch =
      item.patient_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center p-12 bg-card border border-border-subtle rounded-[40px] shadow-xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Sync Failed</h3>
          <p className="text-text-secondary max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-bg-main min-h-screen font-sans transition-colors duration-500">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">
            Appointments
          </h1>
          <p className="text-text-secondary text-sm font-medium mt-1">
            Manage hospital visits and voice consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-40" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2.5 bg-input-bg border border-border-subtle text-text-primary rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button 
            onClick={openBooking}
            disabled={isFetchingDoctors}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isFetchingDoctors ? <Clock className="animate-spin" size={18} /> : <Plus size={18} />}
            Book Appointment
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-card text-text-secondary border border-border-subtle hover:text-text-primary'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-card border border-border-subtle rounded-[32px] shadow-sm overflow-hidden transition-colors duration-300">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-card/50 border-b border-border-subtle">
              <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Patient Identity
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Doctor
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Schedule
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <>
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
                <ShimmerRow />
              </>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredData.map((apt) => (
                  <motion.tr
                    key={apt.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-blue-500/5 group transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs uppercase">
                          {apt.patient_name?.charAt(0)}
                        </div>
                        <span className="font-bold text-text-primary text-sm">{apt.patient_name}</span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                        <Stethoscope size={18} className="opacity-30" /> Dr. {apt.doctor_id}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                        <Clock size={18} className="text-blue-500" /> 
                        {new Date(apt.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight border ${
                        apt.status?.toLowerCase() === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        apt.status?.toLowerCase() === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>

        {!loading && filteredData.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <CalendarIcon className="text-text-secondary" />
            </div>
            <p className="text-text-secondary font-medium">
              No appointments match your criteria.
            </p>
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg"
            >
              <BookAppointmentModal
                doctors={doctors}
                onClose={() => {
                  setIsBookingOpen(false);
                  refresh(); // Fetch updated list from server
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}