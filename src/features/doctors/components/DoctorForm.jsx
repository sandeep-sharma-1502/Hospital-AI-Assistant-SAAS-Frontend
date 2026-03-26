import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Stethoscope, Settings, ShieldCheck, 
  Loader2, Camera, Video, Check, ChevronRight, AlertCircle
} from "lucide-react";
import { createDoctor, updateDoctor } from "../services/doctorApi";
import { useDepartments } from "../../departments/hooks/useDepartments";
import toast from "react-hot-toast";
import { uploadImageToCloudinary } from "../../../services/cloudinary";

import { useEffect } from "react";

export default function DoctorForm({ isOpen, onClose, onSuccess, editData }) {
  const { departments, loading: deptsLoading } = useDepartments();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    specialization: "",
    qualification: "",
    experienceYears: "",
    consultationFee: "",
    slotDuration: 15,
    maxPatientsPerDay: 20,
    licenseNumber: "",
    bio: "",
    profileImage: "",
    supportsVideoConsult: false,
    isActive: true,
    isAvailable: true
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name || "",
          email: editData.email || "",
          phone: editData.phone || "",
          departmentId: editData.departmentId || "",
          specialization: editData.specialization || "",
          qualification: editData.qualification || "",
          experienceYears: editData.experienceYears || "",
          consultationFee: editData.consultationFee || "",
          slotDuration: editData.slotDuration || 15,
          maxPatientsPerDay: editData.maxPatientsPerDay || 20,
          licenseNumber: editData.licenseNumber || "",
          bio: editData.bio || "",
          profileImage: editData.profileImage || "",
          supportsVideoConsult: editData.supportsVideoConsult || false,
          isActive: editData.isActive ?? true,
          isAvailable: editData.isAvailable ?? true
        });
      } else {
        setFormData({
          name: "", email: "", phone: "", departmentId: "", specialization: "",
          qualification: "", experienceYears: "", consultationFee: "",
          slotDuration: 15, maxPatientsPerDay: 20, licenseNumber: "", bio: "",
          profileImage: "", supportsVideoConsult: false, isActive: true, isAvailable: true
        });
      }
      setImageFile(null);
      setErrors({});
      setActiveSection("personal");
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.departmentId) newErrors.departmentId = "Department selection required";
    
    setErrors(newErrors);
    if (newErrors.name) setActiveSection("personal");
    else if (newErrors.departmentId) setActiveSection("professional");
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let imageUrl = formData.profileImage;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImageToCloudinary(imageFile);
        setUploading(false);
      }

      const payload = {
        ...formData,
        profileImage: imageUrl,
        departmentId: Number(formData.departmentId),
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : null,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
        slotDuration: Number(formData.slotDuration),
        maxPatientsPerDay: formData.maxPatientsPerDay ? Number(formData.maxPatientsPerDay) : null,
        slug: formData.name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      };

      if (editData) {
        await updateDoctor(editData.id, payload);
        toast.success("Medical Professional Updated");
      } else {
        await createDoctor(payload);
        toast.success("Medical Professional Onboarded");
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Registry Update Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "personal", label: "Identity", icon: User, hasError: !!errors.name },
    { id: "professional", label: "Professional", icon: Stethoscope, hasError: !!errors.departmentId },
    { id: "clinical", label: "Settings", icon: Settings, hasError: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-center items-center p-4 bg-black/80 backdrop-blur-xl font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#09090b] border border-white/5 w-full max-w-4xl h-[620px] rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex overflow-hidden"
      >
        {/* SIDEBAR */}
        <div className="w-16 sm:w-60 bg-zinc-900/30 border-r border-white/[0.03] p-4 sm:p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-10">
            <div className="px-2 hidden sm:block pt-2 text-left">
              <h2 className="text-xl font-black tracking-tighter italic text-white uppercase">MedFlow OS</h2>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 opacity-80">Registry System</p>
            </div>

            <nav className="space-y-3">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full relative flex items-center justify-center sm:justify-start gap-4 p-4 sm:px-5 sm:py-3.5 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-wider ${
                    activeSection === s.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10' 
                    : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300'
                  }`}
                >
                  <s.icon size={16} />
                  <span className="hidden sm:block">{s.label}</span>
                  {s.hasError && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-2 sm:p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-2">
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${Object.keys(errors).length > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                  style={{ width: activeSection === 'personal' ? '33%' : activeSection === 'professional' ? '66%' : '100%' }}
                />
              </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-[#0c0c0e]">
          <div className="px-8 py-6 border-b border-white/[0.03] flex justify-between items-center bg-zinc-900/40 backdrop-blur-md shrink-0">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{activeSection} Profile</span>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/[0.03] hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all text-zinc-500"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeSection === "personal" && (
                <motion.div key="p" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-8 text-left">
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 rounded-[32px] bg-zinc-900 border border-dashed border-white/10 flex items-center justify-center text-zinc-700 group-hover:border-emerald-500/50 transition-all cursor-pointer overflow-hidden">
                            {uploading ? <Loader2 className="animate-spin text-emerald-500"/> : 
                             formData.profileImage ? <img src={formData.profileImage} className="w-full h-full object-cover" alt="preview"/> : 
                             <Camera size={24}/>}
                        </div>
                        <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white border-4 border-[#0c0c0e] cursor-pointer hover:scale-110 transition-transform">
                            <span className="text-lg font-bold">+</span>
                            <input type="file" accept="image/*" hidden onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setImageFile(file);
                                setFormData((prev) => ({ ...prev, profileImage: URL.createObjectURL(file) }));
                            }}/>
                        </label>
                    </div>
                    <div className="flex-1 w-full">
                        <h3 className="text-lg font-black text-white tracking-tight leading-none">Identity Verification</h3>
                        <p className="text-zinc-500 text-[11px] mt-2 italic font-medium">Please upload a professional medical headshot for the patient portal.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <Field label="Full Name *" name="name" value={formData.name} onChange={handleChange} placeholder="Dr. Sandeep Sharma" error={errors.name} />
                    <Field label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="sandeep@medflow.os" />
                    <Field label="Direct Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 99000 00000" />
                    <Field label="License ID" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="MC-8829-RT" />
                  </div>
                </motion.div>
              )}

              {activeSection === "professional" && (
                <motion.div key="prof" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Medical Department *</label>
                      <div className="relative">
                        <select 
                          name="departmentId" 
                          value={formData.departmentId} 
                          onChange={handleChange} 
                          className={`w-full bg-zinc-900 border ${errors.departmentId ? 'border-rose-500' : 'border-white/5 focus:border-emerald-500/30'} rounded-2xl p-4 text-sm font-bold text-white outline-none cursor-pointer appearance-none transition-all`}
                        >
                          <option value="" className="bg-zinc-900 text-zinc-600">Select Department</option>
                          {departments.map(d => <option key={d.id} value={d.id} className="bg-zinc-900">{d.name}</option>)}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-zinc-600 pointer-events-none" size={16} />
                      </div>
                      {errors.departmentId && <p className="text-[9px] text-rose-500 font-bold ml-1 uppercase">{errors.departmentId}</p>}
                    </div>
                    
                    <Field label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Cardiology Specialists" />
                    <Field label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="MBBS, MD - Medicine" />
                    <Field label="Exp. (Years)" name="experienceYears" value={formData.experienceYears} onChange={handleChange} type="number" placeholder="12" />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 block">Professional Biography</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Brief description for profile view..." className="w-full bg-zinc-900 border border-white/5 rounded-[28px] p-5 text-sm h-28 text-white outline-none resize-none focus:border-emerald-500/30 transition-all" />
                  </div>
                </motion.div>
              )}

              {activeSection === "clinical" && (
                <motion.div key="clin" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <Field label="Cons. Fee (₹)" name="consultationFee" value={formData.consultationFee} onChange={handleChange} type="number" placeholder="800" />
                    <Field label="Slot (Min)" name="slotDuration" value={formData.slotDuration} onChange={handleChange} type="number" placeholder="15" />
                    <Field label="Daily Limit" name="maxPatientsPerDay" value={formData.maxPatientsPerDay} onChange={handleChange} type="number" placeholder="25" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <Toggle label="Video Consult" sub="Remote virtual care" name="supportsVideoConsult" checked={formData.supportsVideoConsult} onChange={handleChange} icon={Video} color="blue" />
                     <Toggle label="Direct Publish" sub="Show in public list" name="isActive" checked={formData.isActive} onChange={handleChange} icon={ShieldCheck} color="emerald" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOOTER */}
          <div className="px-10 py-6 border-t border-white/[0.03] bg-zinc-900/20 shrink-0 flex justify-between items-center">
            <button 
                type="button" 
                onClick={() => { if(activeSection === 'professional') setActiveSection('personal'); if(activeSection === 'clinical') setActiveSection('professional'); }} 
                className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${activeSection === 'personal' ? 'opacity-0' : 'text-zinc-500 hover:text-white'}`}
            >
                Back
            </button>
            <button 
                onClick={activeSection !== 'clinical' ? () => { if(activeSection === 'personal') setActiveSection('professional'); if(activeSection === 'professional') setActiveSection('clinical'); } : handleSubmit} 
                disabled={isSubmitting} 
                className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : activeSection === 'clinical' ? <Check size={16} strokeWidth={3} /> : <ChevronRight size={16} strokeWidth={3} />}
              <span>{activeSection === 'clinical' ? (editData ? 'Save Changes' : 'Complete Onboarding') : 'Continue'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Internal Styled Sub-components
const Field = ({ label, error, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest block">
      {label}
    </label>
    <div className="relative">
      <input 
        {...props} 
        className={`w-full bg-zinc-900 border ${error ? 'border-rose-500' : 'border-white/5 focus:border-emerald-500/30'} rounded-2xl p-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-700`} 
      />
      {error && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500" size={16} />}
    </div>
    {error && <p className="text-[9px] text-rose-500 font-bold ml-1 uppercase">{error}</p>}
  </div>
);

const Toggle = ({ label, sub, icon: Icon, color, ...props }) => {
  const activeStyles = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
  };
  
  const iconBg = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
  };

  return (
    <div className={`flex items-center gap-4 p-5 rounded-[28px] border transition-all cursor-pointer ${props.checked ? activeStyles[color] : 'bg-zinc-900/50 border-white/[0.03] opacity-60'}`} onClick={() => props.onChange({ target: { name: props.name, type: 'checkbox', checked: !props.checked }})}>
      <div className={`p-3 rounded-2xl shrink-0 ${props.checked ? `${iconBg[color]} text-white` : 'bg-zinc-800 text-zinc-600'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[11px] font-black uppercase tracking-tight leading-none">{label}</p>
        <p className="text-[9px] font-bold mt-1 uppercase opacity-60 tracking-tighter">{sub}</p>
      </div>
      <div className="shrink-0 ml-2">
          <div className={`w-10 h-5 rounded-full relative transition-all ${props.checked ? (color === 'blue' ? 'bg-blue-600' : 'bg-emerald-600') : 'bg-zinc-800'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${props.checked ? 'left-6' : 'left-1'}`} />
          </div>
      </div>
    </div>
  );
};