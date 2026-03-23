import { useEffect, useState } from "react";
import { searchPatientsApi, createPatient } from "../services/patientApi";
import { useDebounce } from "../../../hooks/useDebounce";
import { Search, UserPlus, Phone, User, Loader2, Activity, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PatientSearchSelect({ onSelect }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: "", phone: "", email: "", gender: "",
    bloodGroup: "", dateOfBirth: "", address: "",
    insuranceProvider: "", insuranceNumber: ""
  });

  useEffect(() => {
    const fetchPatients = async () => {
      if (!debouncedQuery) { setPatients([]); return; }
      try {
        setLoading(true);
        const data = await searchPatientsApi(debouncedQuery);
        setPatients(data || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchPatients();
  }, [debouncedQuery]);

  const handleCreate = async () => {
    if (!newPatient.name || !newPatient.phone) return;
    try {
      setIsCreating(true);
      const res = await createPatient(newPatient);
      onSelect(res?.data || res);
    } catch (err) { console.error(err); } 
    finally { setIsCreating(false); }
  };

  const showForm = !loading && debouncedQuery && patients.length === 0;

  return (
    <div className="space-y-6 w-full">
      {/* 1. SEARCH BAR */}
      <div className="relative group px-2">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
        <input
          placeholder="Lookup Name or Mobile Vector..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-xs font-bold text-white focus:outline-none focus:border-blue-500/40 transition-all shadow-2xl"
        />
        {loading && <Loader2 size={16} className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin text-blue-500" />}
      </div>

      <div className="px-2">
        {/* 2. SEARCH RESULTS */}
        {!showForm && patients.length > 0 && (
          <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {patients.map((p) => (
              <button key={p.id} onClick={() => onSelect(p)} className="flex items-center gap-4 p-3 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400">
                  <Fingerprint size={18} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-zinc-200 uppercase italic leading-none">{p.name}</p>
                  <p className="text-[10px] font-bold text-zinc-600 mt-1.5 tabular-nums tracking-widest">{p.phone}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 3. IMPROVED REGISTRATION FORM (The Fix) */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-6 bg-blue-600/[0.02] border border-white/5 rounded-[32px] space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.03] pb-4">
              <UserPlus size={18} className="text-blue-500" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">New Node Registration</h3>
            </div>

            {/* Change: grid-cols-2 for more width per input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* PART 1: PRIMARY IDENTITY */}
              <div className="space-y-3">
                <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em] px-1">01. Primary Identity</p>
                <div className="space-y-2">
                  <input placeholder="Full Legal Name *" value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} 
                         className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500/40 outline-none transition-all" />
                  <input placeholder="Phone Vector *" value={newPatient.phone} onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} 
                         className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500/40 outline-none transition-all" />
                </div>
              </div>

              {/* PART 2: CONTACT & LOCATION */}
              <div className="space-y-3">
                <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em] px-1">02. Communication</p>
                <div className="space-y-2">
                  <input placeholder="Email Address" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} 
                         className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500/40 outline-none" />
                  <input placeholder="Residential Address" value={newPatient.address} onChange={(e) => setNewPatient({...newPatient, address: e.target.value})} 
                         className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500/40 outline-none" />
                </div>
              </div>

              {/* PART 3: BIOLOGICAL DATA */}
              <div className="space-y-3">
                <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em] px-1">03. Bio-Metrics</p>
                <div className="grid grid-cols-2 gap-2">
                  <select value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})} 
                          className="bg-zinc-950 border border-white/10 rounded-xl py-3 px-3 text-[11px] font-bold text-zinc-400 uppercase outline-none focus:border-blue-500/40">
                    <option value="">Sex</option><option value="MALE">Male</option><option value="FEMALE">Female</option>
                  </select>
                  <select value={newPatient.bloodGroup} onChange={(e) => setNewPatient({...newPatient, bloodGroup: e.target.value})} 
                          className="bg-zinc-950 border border-white/10 rounded-xl py-3 px-3 text-[11px] font-bold text-zinc-400 uppercase outline-none focus:border-blue-500/40">
                    <option value="A_POS">A+</option>
                    <option value="A_NEG">A-</option>
                    <option value="B_POS">B+</option>
                    <option value="B_NEG">B-</option>
                    <option value="AB_POS">AB+</option>
                    <option value="AB_NEG">AB-</option>
                    <option value="O_POS">O+</option>
                    <option value="O_NEG">O-</option>
                  </select>
                </div>
                <input type="date" value={newPatient.dateOfBirth} onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})} 
                       className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-[11px] font-bold text-zinc-500 outline-none" />
              </div>

              {/* PART 4: INSURANCE */}
              <div className="space-y-3">
                <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em] px-1">04. Insurance Protocol</p>
                <div className="space-y-2">
                  <input placeholder="Provider Name" value={newPatient.insuranceProvider} onChange={(e) => setNewPatient({...newPatient, insuranceProvider: e.target.value})} 
                         className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500/40 outline-none" />
                  <input placeholder="Policy ID #" value={newPatient.insuranceNumber} onChange={(e) => setNewPatient({...newPatient, insuranceNumber: e.target.value})} 
                         className="w-full bg-zinc-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500/40 outline-none" />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating || !newPatient.name || !newPatient.phone}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98] mt-4"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
              Initialize & Deploy Patient Node
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}