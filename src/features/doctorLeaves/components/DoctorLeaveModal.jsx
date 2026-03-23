import { useState, useEffect } from "react";
import { X, Coffee, Loader2, Check, Calendar, MessageSquare, Info } from "lucide-react";
import { createDoctorLeave, updateDoctorLeave } from "../services/doctorLeaveApi";
import toast from "react-hot-toast";

export default function DoctorLeaveModal({ doctor, isOpen, onClose, onSuccess, editData = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "Casual",
    description: ""
  });

  const formatDate = (date) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        startDate: formatDate(editData.startDate),
        endDate: formatDate(editData.endDate),
        leaveType: editData.leaveType || "Casual",
        description: editData.description || "",
      });
    } else {
      setFormData({
        startDate: "",
        endDate: "",
        leaveType: "Casual",
        description: ""
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!doctor?.id) {
      toast.error("Doctor ID missing from registry");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { doctorId: doctor.id, ...formData };
      if (editData) {
        await updateDoctorLeave(editData.id, payload);
        toast.success("Leave records updated");
      } else {
        await createDoctorLeave(payload);
        toast.success("Leave registered in system");
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error("Registry update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl font-sans text-white">
      <div className="bg-[#09090b] border border-white/[0.05] w-full max-w-md rounded-[40px] shadow-[0_32px_80px_rgba(249,115,22,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header - Amber Theme */}
        <div className="px-8 py-6 border-b border-white/[0.03] flex justify-between items-center bg-orange-500/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
              <Coffee size={18} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {editData ? "Modify Leave" : "Register Leave"}
              </h3>
              <p className="text-[9px] font-bold text-orange-500/80 uppercase tracking-widest mt-0.5 italic text-left">Staff Absence Log</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  className="w-full h-14 px-4 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-[13px] text-white outline-none focus:border-orange-500/40 transition-all [color-scheme:dark]"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  className="w-full h-14 px-4 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-[13px] text-white outline-none focus:border-orange-500/40 transition-all [color-scheme:dark]"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Leave Classification */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">
              Leave Classification
            </label>
            <div className="relative">
                <select
                className="w-full h-14 px-5 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-[13px] text-white outline-none focus:border-orange-500/40 appearance-none transition-all cursor-pointer"
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                >
                <option value="Casual">Casual Leave</option>
                <option value="Medical">Medical Leave</option>
                <option value="Vacation">Annual Vacation</option>
                <option value="Conference">Professional Conference</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                    <Info size={14} />
                </div>
            </div>
          </div>

          {/* Justification Note */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">
              Absence Justification
            </label>
            <div className="relative">
                <textarea
                className="w-full p-5 rounded-[28px] bg-zinc-900 border border-white/5 font-medium text-[13px] text-white outline-none focus:border-orange-500/40 min-h-[120px] transition-all placeholder:text-zinc-700 resize-none"
                placeholder="Detailed reason for absence (for administrative records)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <MessageSquare className="absolute right-5 top-5 text-zinc-800" size={16} />
            </div>
          </div>

          {/* Submission Block */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-orange-600 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-orange-600/10 flex items-center justify-center gap-3 hover:bg-orange-500 active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Check size={16} strokeWidth={3} />
            )}
            <span>{editData ? "Update Registry" : "Confirm Absence"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}