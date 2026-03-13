import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import DoctorForm from "../../features/doctors/components/DoctorForm";
import DoctorList from "../../features/doctors/components/DoctorList";
import ScheduleForm from "../../features/doctors/components/ScheduleForm";
import { Toaster } from "react-hot-toast";

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative p-8 min-h-screen transition-colors duration-500 bg-bg-main overflow-hidden">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid size={16} className="text-blue-500" />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Medical Staff</span>
          </div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Physicians</h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Register New Physician
        </button>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {/* 🔥 refreshKey passed to trigger shimmer on updates */}
          <DoctorList 
            refreshKey={refreshKey}
            selectedId={selectedDoctor?.id}
            onSelect={(doc) => setSelectedDoctor(doc)} 
          />
        </div>
        <aside className="lg:col-span-1 h-full">
          <ScheduleForm doctor={selectedDoctor} />
        </aside>
      </div>

      {/* IN-PAGE POPUP (Scoped to this container) */}
      <DoctorForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onDoctorCreated={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}