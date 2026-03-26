import { useState } from "react";
import { UserPlus, Calendar, Coffee, Ban, User, Activity, Loader2, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import DoctorList from "../../features/doctors/components/DoctorList";
import DoctorProfileView from "../../features/doctors/components/DoctorProfileView";
import DoctorScheduleView from "../../features/doctors/components/DoctorScheduleView";
import ScheduleForm from "../../features/doctors/components/ScheduleForm";
import DoctorForm from "../../features/doctors/components/DoctorForm"; // <--- New Component
import DoctorBlockModal from "../../features/doctorBlocks/components/DoctorBlockModal";
import DoctorLeaveModal from "../../features/doctorLeaves/components/DoctorLeaveModal";
import DoctorBlocksView from "../../features/doctorBlocks/components/DoctorBlocksView";
import DoctorLeavesView from "../../features/doctorLeaves/components/DoctorLeavesView";

// Hook
import { useDoctors } from "../../features/doctors/hooks/useDoctors";

const tabs = [
  { id: "profile", icon: <User size={14}/>, label: "Info" },
  { id: "schedule", icon: <Calendar size={14}/>, label: "Roster" },
  { id: "blocks", icon: <Ban size={14}/>, label: "Blocks" },
  { id: "leaves", icon: <Coffee size={14}/>, label: "Leaves" }
];

export default function DoctorsPage() {
  const { doctors, isLoading, refreshDoctors } = useDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for tabs

  const handleSuccess = () => {
    refreshDoctors();
    setRefreshTrigger(t => t + 1);
  };

  // --- EDIT & MODAL STATES ---
  const [editScheduleData, setEditScheduleData] = useState(null);
  const [editBlockData, setEditBlockData] = useState(null);
  const [editLeaveData, setEditLeaveData] = useState(null);
  const [editDoctorData, setEditDoctorData] = useState(null);

  const [modals, setModals] = useState({ 
    schedule: false, 
    block: false, 
    leave: false,
    onboard: false // <--- New State for Add Doctor
  });

  const toggleModal = (type, state) => {
    if (!state) {
      if (type === 'schedule') setEditScheduleData(null);
      if (type === 'block') setEditBlockData(null);
      if (type === 'leave') setEditLeaveData(null);
      if (type === 'onboard') setEditDoctorData(null);
    }
    setModals(prev => ({ ...prev, [type]: state }));
  };

  const handleEditSchedule = (data) => {
    setEditScheduleData(data);
    setModals(prev => ({ ...prev, schedule: true }));
  };

  const handleEditBlock = (data) => {
    setEditBlockData(data);
    setModals(prev => ({ ...prev, block: true }));
  };

  const handleEditLeave = (data) => {
    setEditLeaveData(data);
    setModals(prev => ({ ...prev, leave: true }));
  };

  return (
    <div className="flex h-[calc(100vh-1rem)] bg-[#09090b] p-4 gap-6 overflow-hidden relative">
      
      {/* Background Glow Effect */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* --- SIDEBAR: STAFF LIST --- */}
      <div className="w-85 flex flex-col gap-6 shrink-0 relative z-10">
        <div className="flex justify-between items-end px-2">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">Staff</h1>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-2">Personnel Hub</p>
          </div>
          
          {/* ADD DOCTOR BUTTON */}
          <button 
            onClick={() => toggleModal('onboard', true)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.25)] transition-all active:scale-95 flex items-center justify-center group"
          >
            <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex-1 bg-[#0c0c0e] border border-white/[0.04] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
          <DoctorList 
            doctors={doctors} 
            isLoading={isLoading} 
            onSelect={(doc) => { setSelectedDoctor(doc); setActiveTab("profile"); }} 
            selectedId={selectedDoctor?.id} 
          />
        </div>
      </div>

      {/* --- MAIN CONSOLE --- */}
      <main className="flex-1 bg-[#0c0c0e] border border-white/[0.04] rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {selectedDoctor ? (
            <motion.div 
              key={selectedDoctor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col h-full"
            >
              {/* Header Section */}
              <div className="p-8 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01] backdrop-blur-xl">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(37,99,235,0.3)] uppercase overflow-hidden shrink-0">
                    {selectedDoctor.profileImage ? (
                      <img src={selectedDoctor.profileImage} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedDoctor.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{selectedDoctor.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{selectedDoctor.specialization}</p>
                    </div>
                  </div>
                </div>
                
                {/* TAB NAVIGATION & ACTIONS */}
                <div className="flex items-center gap-4">
                  <nav className="flex bg-[#09090b] p-1 rounded-[20px] border border-white/[0.05] relative">
                    {tabs.map(tab => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`group relative flex items-center gap-2 px-6 py-2.5 rounded-[16px] text-[10px] font-black transition-colors duration-300 z-10 ${
                            isActive ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTabPill"
                              className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-[16px] shadow-lg shadow-black/20"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span className="relative z-20 flex items-center gap-2 uppercase">
                            {tab.icon} {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </nav>

                  <button
                    onClick={() => { setEditDoctorData(selectedDoctor); toggleModal('onboard', true); }}
                    className="p-3 bg-white/[0.03] hover:bg-emerald-500/10 hover:text-emerald-500 border border-white/[0.05] hover:border-emerald-500/30 text-zinc-500 rounded-[16px] transition-all shadow-sm"
                    title="Edit Doctor Info"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>

              {/* Dynamic Content Area */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gradient-to-b from-transparent to-black/10">
                <div className="max-w-5xl mx-auto">
                  {activeTab === "profile" && <DoctorProfileView doctor={selectedDoctor} onUpdate={handleSuccess} />}
                  {activeTab === "schedule" && (
                    <DoctorScheduleView 
                      doctorId={selectedDoctor.id} 
                      onOpenModal={() => toggleModal('schedule', true)} 
                      onEditClick={handleEditSchedule}
                      refreshTrigger={refreshTrigger}
                    />
                  )}
                  {activeTab === "blocks" && (
                    <DoctorBlocksView 
                      doctorId={selectedDoctor.id} 
                      onOpenModal={() => toggleModal('block', true)} 
                      onEditClick={handleEditBlock}
                      refreshTrigger={refreshTrigger}
                    />
                  )}
                  {activeTab === "leaves" && (
                    <DoctorLeavesView 
                      doctorId={selectedDoctor.id} 
                      onOpenModal={() => toggleModal('leave', true)} 
                      onEditClick={handleEditLeave}
                      refreshTrigger={refreshTrigger}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals Container */}
      
      {/* 1. Add New Doctor Modal */}
      <DoctorForm 
        isOpen={modals.onboard}
        onClose={() => toggleModal('onboard', false)}
        onSuccess={() => {
          refreshDoctors();
          toggleModal('onboard', false);
        }}
        editData={editDoctorData}
      />

      {/* 2. Operational Modals (Requires Selected Doctor) */}
      {selectedDoctor && (
        <>
          <ScheduleForm 
            doctor={selectedDoctor} 
            isOpen={modals.schedule} 
            onClose={() => toggleModal('schedule', false)} 
            onSuccess={handleSuccess} 
            editData={editScheduleData}
          />
          <DoctorBlockModal 
            doctor={selectedDoctor} 
            isOpen={modals.block} 
            onClose={() => toggleModal('block', false)} 
            onSuccess={handleSuccess}
            editData={editBlockData}
          />
          <DoctorLeaveModal 
            doctor={selectedDoctor} 
            isOpen={modals.leave} 
            onClose={() => toggleModal('leave', false)} 
            onSuccess={handleSuccess}
            editData={editLeaveData}
          />
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 rounded-[38px] bg-[#09090b] border border-white/[0.05] flex items-center justify-center text-zinc-800 shadow-2xl">
          <Activity size={40} strokeWidth={1} className="text-zinc-700 opacity-50" />
        </div>
      </div>
      <div className="text-center max-w-xs">
        <p className="font-black text-white text-[11px] tracking-[0.5em] uppercase">Selection Required</p>
        <p className="text-zinc-600 text-[10px] mt-3 italic font-medium leading-relaxed">
          Select a specialist from the personnel list to manage their clinical operations and roster data.
        </p>
      </div>
    </div>
  );
}