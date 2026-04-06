import React, { useState } from 'react';
import { useDepartments } from '../../features/departments/hooks/useDepartments';
import DepartmentCard from '../../features/departments/components/DepartmentCard';
import DepartmentFormModal from '../../features/departments/components/DepartmentFormModal'
import { Plus, Loader2, X, Globe, Hash, Calendar, ShieldCheck, Activity, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepartmentsPage() {
  const { departments, loading, addDept, editDept, removeDept } = useDepartments();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null); 
  const [formData, setFormData] = useState({ name: '', code: '', description: '', isActive: true });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', description: '', isActive: true });
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingId(dept.id);
    setFormData(dept);
    setShowModal(true);
  };

  const handleFormSubmit = async () => {
    const success = editingId ? await editDept(editingId, formData) : await addDept(formData);
    if (success) setShowModal(false);
  };

  const handleView = (id) => {
    const dept = departments.find(d => d.id === id);
    setSelectedDept(selectedDept?.id === id ? null : dept);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-[#09090b] p-4 gap-4 font-sans text-slate-900 dark:text-white">
      
      {/* LEFT: MAIN TERMINAL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between mb-8 shrink-0 px-2">
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic leading-none uppercase bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Hospital Wings
            </h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-zinc-500">Core Registry v4.2 // Operational</p>
            </div>
          </div>
          <button 
            onClick={handleOpenAdd} 
            className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95"
          >
            <div className="flex items-center gap-2 relative z-10 font-black text-[11px] uppercase tracking-widest">
                <Plus size={16} strokeWidth={3} /> Register New Wing
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </header>

        {/* HIGH-DENSITY STATS */}
        <section className="grid grid-cols-3 gap-4 mb-8 shrink-0">
          {[
            { label: 'Total Units', value: departments.length, icon: <Layers size={14}/> }, 
            { label: 'Active Status', value: departments.filter(d => d.isActive).length, icon: <Activity size={14}/> }, 
            { label: 'System Load', value: 'Optimal', icon: <ShieldCheck size={14}/> }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900/40 border border-white/[0.03] rounded-3xl p-5 group hover:border-blue-500/20 transition-all">
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-500 group-hover:text-blue-500 transition-colors mb-2">
                {stat.icon}
                <p className="text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
              <h2 className="text-2xl font-black tabular-nums tracking-tight">{stat.value}</h2>
            </div>
          ))}
        </section>

        {/* DYNAMIC GRID */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600">Syncing Registry...</p>
            </div>
          ) : (
            <motion.div 
              layout 
              className={`grid gap-5 pt-2 ${selectedDept ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}
            >
              <AnimatePresence mode='popLayout'>
                {departments.map(dept => (
                  <motion.div 
                    key={dept.id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DepartmentCard 
                      dept={dept} 
                      isSelected={selectedDept?.id === dept.id}
                      onEdit={handleOpenEdit}
                      onDelete={removeDept}
                      onView={handleView}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

        {/* CENTERED MODAL: The Detail View */}
        <AnimatePresence>
        {selectedDept && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedDept(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                className="w-full max-w-lg bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-[40px] flex flex-col shadow-[0_0_100px_rgba(37,99,235,0.15)] relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Top Glowing Edge */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
                  
                  {/* Close Button */}
                  <button 
                  onClick={() => setSelectedDept(null)} 
                  className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-white/[0.05] backdrop-blur-md"
                  >
                  <X size={18} />
                  </button>

                  {/* Detail Content */}
                  <div className="overflow-y-auto p-10 space-y-8 custom-scrollbar relative z-10 max-h-[85vh]">
                  
                  {/* Main Identity Section */}
                  <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                  >
                      <span className="text-blue-500 font-black text-[12px] tracking-[0.4em] uppercase italic opacity-80">
                      {selectedDept.code}
                      </span>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none bg-gradient-to-br from-white to-zinc-600 bg-clip-text text-transparent">
                      {selectedDept.name}
                      </h2>
                  </motion.div>

                  {/* Operational Briefing */}
                  <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-600 tracking-[0.2em] ml-1">Operational Briefing</p>
                      <div className="bg-slate-50 dark:bg-zinc-950/50 p-6 rounded-[32px] border border-white/[0.03] text-[14px] leading-relaxed italic text-slate-600 dark:text-zinc-400 font-medium">
                      {selectedDept.description || 'System notice: No administrative briefing provided for this specific unit.'}
                      </div>
                  </div>

                  {/* Technical Matrix */}
                  <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-600 tracking-[0.2em] ml-1">Technical Matrix</p>
                      <div className="grid grid-cols-1 gap-2.5">
                      {[
                          { icon: <Globe size={14}/>, label: 'Slug', val: selectedDept.slug },
                          { icon: <Hash size={14}/>, label: 'Index', val: selectedDept.displayOrder },
                          { icon: <Calendar size={14}/>, label: 'Sync', val: new Date(selectedDept.createdAt).toLocaleDateString() }
                      ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950/30 rounded-2xl border border-slate-100 dark:border-white/[0.02] hover:border-slate-200 dark:border-white/[0.08] transition-colors">
                          <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest">
                              <div className="text-blue-500/50">{item.icon}</div> {item.label}
                          </div>
                          <span className="text-[11px] font-black tabular-nums text-slate-900 dark:text-white">
                              {item.val}
                          </span>
                          </div>
                      ))}
                      </div>
                  </div>

                  {/* Integrity Status */}
                  <div className={`p-5 rounded-[32px] border flex items-center gap-4 ${selectedDept.isActive ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : 'bg-rose-500/5 border-rose-500/10 text-rose-500'}`}>
                      <ShieldCheck size={20} strokeWidth={2.5} />
                      <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] block">
                          {selectedDept.isActive ? 'Verified Integrity' : 'Node Deactivated'}
                      </span>
                      <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-0.5 italic">
                          Status: {selectedDept.isActive ? 'Online' : 'Standby'}
                      </p>
                      </div>
                  </div>
                  </div>

              </motion.div>
            </motion.div>
        )}
        </AnimatePresence>

      {/* REUSABLE FORM MODAL */}
      <AnimatePresence>
        <DepartmentFormModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          isEditing={!!editingId}
        />
      </AnimatePresence>
    </div>
  );
}