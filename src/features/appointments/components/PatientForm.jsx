import React, { useState } from "react";
import { 
  Search, User, Phone, Fingerprint, Loader2, Check, 
  Plus, Mail, Calendar, Droplets, MapPin, Shield, Info, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PatientForm({ onSubmit, loading, patients = [] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  
  const [newPatient, setNewPatient] = useState({
    name: "", phone: "", email: "", gender: "",
    bloodGroup: "", dateOfBirth: "", address: "",
    insuranceProvider: "", insuranceNumber: "", medicalNotes: ""
  });

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.phone?.includes(search)
  );

  // Jab selection confirm ho
  const handleConfirmSelection = () => {
    if (!selectedId) return;
    onSubmit({ patientId: selectedId });
  };

  // Jab naya patient register ho
  const handleRegisterAndBook = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone) return;
    onSubmit({ isNewPatient: true, ...newPatient });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[450px]">
      
      {/* --- LEFT SECTION: IDENTITY LOOKUP --- */}
      <div className="flex-1 space-y-4 border-r border-white/[0.03] pr-8">
        <div className="flex items-center gap-2 mb-6">
          <Fingerprint size={16} className="text-blue-500" />
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
            Identity <span className="text-blue-500">Lookup</span>
          </h2>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input
            type="text"
            placeholder="Search Registry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredPatients.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                // Reset new patient form if selecting existing
                setNewPatient({ name: "", phone: "" }); 
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                selectedId === p.id 
                ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                : "bg-zinc-950/50 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${selectedId === p.id ? "bg-blue-600 text-white" : "bg-zinc-900 text-zinc-600"}`}>
                  <User size={12} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-zinc-200 uppercase italic leading-none">{p.name}</p>
                  <p className="text-[9px] font-bold text-zinc-600 tabular-nums mt-1">{p.phone}</p>
                </div>
              </div>
              {selectedId === p.id && <Check size={14} className="text-blue-500" strokeWidth={3} />}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirmSelection}
          disabled={!selectedId || loading}
          className="w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-10"
        >
          {loading ? <Loader2 size={14} className="animate-spin"/> : <ChevronRight size={14} />}
          Use Selected Identity
        </button>
      </div>

      {/* --- RIGHT SECTION: NEW REGISTRATION --- */}
      <div className="flex-[1.5] space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Plus size={16} className="text-emerald-500" />
          <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
            Register <span className="text-emerald-500">New Node</span>
          </h2>
        </div>

        <form onSubmit={handleRegisterAndBook} className="grid grid-cols-2 gap-4">
          {/* Row 1: Core */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Legal Name</label>
            <input required placeholder="Name" value={newPatient.name} 
              onChange={(e) => {setNewPatient({...newPatient, name: e.target.value}); setSelectedId("");}} 
              className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-bold text-white focus:border-emerald-500/40 focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Phone Vector</label>
            <input required placeholder="Mobile" value={newPatient.phone} 
              onChange={(e) => {setNewPatient({...newPatient, phone: e.target.value}); setSelectedId("");}} 
              className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-bold text-white focus:border-emerald-500/40 focus:outline-none" />
          </div>

          {/* Row 2: Secondary */}
          <div className="space-y-1 col-span-2">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Communication Email</label>
            <input type="email" placeholder="Email" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} 
              className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-3 text-xs font-bold text-white focus:border-emerald-500/40 focus:outline-none" />
          </div>

          {/* Row 3: Medical Meta */}
          <div className="grid grid-cols-3 gap-2 col-span-2">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Gender</label>
              <select value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})} 
                className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-2 text-[10px] font-bold text-zinc-400 focus:border-emerald-500/40 focus:outline-none">
                <option value="">Select</option>
                <option value="MALE">Male</option><option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Blood</label>
              <select value={newPatient.bloodGroup} onChange={(e) => setNewPatient({...newPatient, bloodGroup: e.target.value})} 
                className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-2 text-[10px] font-bold text-zinc-400 focus:border-emerald-500/40 focus:outline-none">
                <option value="">N/A</option><option value="O_POS">O+</option><option value="A_POS">A+</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Birth Date</label>
              <input type="date" value={newPatient.dateOfBirth} onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})} 
                className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-2 text-[10px] font-bold text-zinc-500 focus:border-emerald-500/40 focus:outline-none" />
            </div>
          </div>

          {/* Row 4: Insurance */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Ins. Provider</label>
            <input placeholder="Provider" value={newPatient.insuranceProvider} onChange={(e) => setNewPatient({...newPatient, insuranceProvider: e.target.value})} 
              className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-3 text-[10px] font-bold text-white focus:border-emerald-500/40 focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">Policy Vector</label>
            <input placeholder="Policy #" value={newPatient.insuranceNumber} onChange={(e) => setNewPatient({...newPatient, insuranceNumber: e.target.value})} 
              className="w-full bg-zinc-950 border border-white/5 rounded-lg py-2.5 px-3 text-[10px] font-bold text-white focus:border-emerald-500/40 focus:outline-none" />
          </div>

          <button
            type="submit"
            disabled={loading || !newPatient.name || !newPatient.phone}
            className="col-span-2 mt-2 py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-10"
          >
            {loading ? "Registering..." : "Create Identity & Deploy"}
          </button>
        </form>
      </div>
    </div>
  );
}