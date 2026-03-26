import { useState, useEffect } from "react";
import { X, Ban, Loader2, Check, AlertTriangle, CalendarClock } from "lucide-react";
import { createDoctorBlock, updateDoctorBlock } from "../services/doctorBlockApi";
import toast from "react-hot-toast";

export default function DoctorBlockModal({ doctor, isOpen, onClose, onSuccess, editData = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    blockType: "ADMIN",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        reason: editData.reason || "",
        blockType: editData.blockType || "ADMIN",
        startTime: editData.startTime || "",
        endTime: editData.endTime || "",
      });
    } else {
      setFormData({ reason: "", blockType: "ADMIN", startTime: "", endTime: "" });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { doctorId: doctor.id, ...formData };
      if (editData) {
        await updateDoctorBlock(editData.id, payload);
        toast.success("Restriction period updated");
      } else {
        await createDoctorBlock(payload);
        toast.success("Schedule successfully blocked");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Security/Registry update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl font-sans text-white">
      <div className="bg-[#09090b] border border-white/[0.05] w-full max-w-md rounded-[40px] shadow-[0_32px_80px_rgba(225,29,72,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header - Warning Red Style */}
        <div className="px-8 py-6 border-b border-white/[0.03] flex justify-between items-center bg-rose-600/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-xl text-white shadow-lg shadow-rose-600/20">
              <Ban size={18} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {editData ? "Update Restriction" : "Block Schedule"}
              </h3>
              <p className="text-[9px] font-bold text-rose-500/80 uppercase tracking-widest mt-0.5 italic">Critical Action</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Reason Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">
              Administrative Reason
            </label>
            <div className="relative">
                <input 
                  required
                  className="w-full h-14 px-5 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-sm text-white outline-none focus:border-rose-500/40 transition-all placeholder:text-zinc-700"
                  placeholder="e.g. Emergency Leave, Surgery..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
                <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800" size={16} />
            </div>

          {/* Block Type Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Block Category</label>
            <select
              className="w-full h-14 px-5 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-sm text-white outline-none focus:border-rose-500/40 transition-all [color-scheme:dark] cursor-pointer appearance-none"
              value={formData.blockType}
              onChange={(e) => setFormData({...formData, blockType: e.target.value})}
            >
              <option value="ADMIN">Administrative</option>
              <option value="SURGERY">Surgery</option>
              <option value="MEETING">Meeting / Conference</option>
              <option value="PERSONAL">Personal</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Restriction Starts</label>
              <div className="relative group">
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full h-14 px-5 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-sm text-white outline-none focus:border-blue-500/40 transition-all [color-scheme:dark]"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                  <CalendarClock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1 tracking-widest">Restriction Ends</label>
              <div className="relative group">
                  <input 
                    type="datetime-local" 
                    required
                    className="w-full h-14 px-5 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-sm text-white outline-none focus:border-blue-500/40 transition-all [color-scheme:dark]"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                  <CalendarClock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Warning Note */}
          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/[0.03]">
              <p className="text-[9px] text-zinc-500 leading-relaxed font-medium italic">
                Note: Blocking the schedule will prevent any new patient bookings during this period. Existing appointments may need to be rescheduled manually.
              </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-rose-600 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-rose-600/10 flex items-center justify-center gap-3 hover:bg-rose-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Check size={16} strokeWidth={3} />
            )}
            <span>{editData ? "Update Restriction" : "Confirm Schedule Block"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}