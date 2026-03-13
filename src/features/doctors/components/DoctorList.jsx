import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Users } from "lucide-react";
import { fetchDoctors } from "../services/doctorApi";

// --- Shimmer Item Component ---
const ShimmerItem = () => (
  <div className="flex items-center justify-between p-5 animate-pulse border-b border-border-subtle last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-border-subtle/50" />
      <div className="space-y-2">
        <div className="h-4 w-32 bg-border-subtle/50 rounded-md" />
        <div className="h-3 w-40 bg-border-subtle/30 rounded-md" />
      </div>
    </div>
    <div className="w-5 h-5 bg-border-subtle/30 rounded-full" />
  </div>
);

export default function DoctorList({ onSelect, selectedId, refreshKey }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, [refreshKey]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Error loading doctors:", err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <div className="bg-card border border-border-subtle rounded-[32px] shadow-sm overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-card/50">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          <h3 className="font-bold text-text-primary">Medical Staff Directory</h3>
        </div>
        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase">
          {loading ? "..." : `${doctors.length} Staff`}
        </span>
      </div>

      <div className="divide-y divide-border-subtle max-h-[600px] overflow-y-auto">
        {loading ? (
          <>
            <ShimmerItem />
            <ShimmerItem />
            <ShimmerItem />
          </>
        ) : (
          <AnimatePresence mode="popLayout">
            {doctors.map((doc, index) => (
              <motion.div
                layout
                key={doc.id}
                onClick={() => onSelect(doc)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.04,
                    duration: 0.1, 
                    ease: "linear"
                  } 
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center justify-between p-5 cursor-pointer transition-all hover:bg-blue-500/5 group ${
                  selectedId === doc.id
                    ? "bg-blue-500/10 ring-1 ring-inset ring-blue-500/20"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar Section */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    selectedId === doc.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-input-bg text-text-secondary border border-border-subtle"
                  }`}>
                    {doc.name ? doc.name.split(" ").map(n => n[0]).join("") : "?"}
                  </div>

                  {/* Info Section */}
                  <div>
                    <p className="text-sm font-bold text-text-primary group-hover:text-blue-500 transition-colors">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-text-secondary font-medium uppercase tracking-wider">
                        {doc.department}
                      </p>
                      {doc.specialization && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-border-subtle" />
                          <p className="text-[11px] text-blue-500/70 font-bold italic">
                            {doc.specialization}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Icon */}
                <ChevronRight 
                  size={18} 
                  className={`transition-all duration-300 ${
                    selectedId === doc.id ? "text-blue-500 translate-x-1" : "text-text-secondary opacity-20"
                  }`} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {!loading && doctors.length === 0 && (
          <div className="p-20 text-center text-text-secondary opacity-50 text-sm">
            No physicians registered yet.
          </div>
        )}
      </div>
    </div>
  );
}