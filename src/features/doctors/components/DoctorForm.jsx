import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Save, Briefcase, Award } from "lucide-react";
import { createDoctor } from "../services/doctorApi";
import toast from "react-hot-toast";

export default function DoctorForm({ isOpen, onClose, onDoctorCreated }) {
  const [form, setForm] = useState({ name: "", department: "", specialization: "" });
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const doctor = await createDoctor(form);

    onDoctorCreated(doctor); // refresh parent
    setForm({ name: "", department: "", specialization: "" });

    toast.success("Physician Added Successfully");
    onClose();

  } catch (err) {
    toast.error(err); // now shows backend message
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scoped Backdrop - absolute instead of fixed */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-main/40 backdrop-blur-md z-40 transition-colors duration-500"
          />
          
          {/* Scoped Modal - absolute instead of fixed */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-6"
          >
            <div className="bg-card border border-border-subtle rounded-[40px] shadow-2xl overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-border-subtle flex justify-between items-center bg-blue-600">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none">Register Physician</h3>
                    <p className="text-white/70 text-[10px] uppercase tracking-widest mt-1 font-bold">New Entry</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Full Identity</label>
                  <input
                    required
                    className="w-full px-5 py-4 bg-input-bg border border-border-subtle rounded-2xl text-sm text-text-primary focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Dr. Sarah Connor"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Department</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-30" size={16} />
                      <input
                        required
                        className="w-full pl-11 pr-5 py-4 bg-input-bg border border-border-subtle rounded-2xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Neurology"
                        value={form.department}
                        onChange={(e) => setForm({...form, department: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Specialization</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-30" size={16} />
                      <input
                        required
                        className="w-full pl-11 pr-5 py-4 bg-input-bg border border-border-subtle rounded-2xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Consultant"
                        value={form.specialization}
                        onChange={(e) => setForm({...form, specialization: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-[24px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-500/20 mt-4"
                >
                  {loading ? "Syncing..." : <><Save size={18}/> Save Physician Profile</>}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}