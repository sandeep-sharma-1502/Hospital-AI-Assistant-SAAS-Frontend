import { Mail, Phone, Award, Clock, DollarSign, Briefcase, FileText } from "lucide-react";

export default function DoctorProfileView({ doctor }) {
  const infoItems = [
    { icon: <Mail size={14}/>, label: "Registry Email", value: doctor.email || "N/A", color: "text-blue-500" },
    { icon: <Phone size={14}/>, label: "Emergency Contact", value: doctor.phone || "N/A", color: "text-emerald-500" },
    { icon: <Briefcase size={14}/>, label: "Clinical Tenure", value: `${doctor.experienceYears} Years`, color: "text-indigo-500" },
    { icon: <Award size={14}/>, label: "Credentials", value: doctor.qualification || "N/A", color: "text-amber-500" },
    { icon: <DollarSign size={14}/>, label: "Consultation Fee", value: `₹${doctor.consultationFee}`, color: "text-emerald-400" },
    { icon: <Clock size={14}/>, label: "Session Buffer", value: `${doctor.slotDuration} Mins`, color: "text-rose-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
      {infoItems.map((item, idx) => (
        <div 
          key={idx} 
          className="p-5 bg-zinc-900/40 border border-white/[0.03] rounded-[28px] group hover:bg-zinc-900/60 hover:border-white/[0.08] transition-all duration-300"
        >
          <div className="flex items-center gap-3.5 mb-3">
            <div className={`p-2.5 bg-zinc-950 rounded-xl ${item.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{item.label}</span>
          </div>
          <p className="text-[13px] font-black text-white ml-12 tracking-tight">
            {item.value}
          </p>
        </div>
      ))}
      
      {/* Bio Section - Full Width */}
      <div className="col-span-full mt-2 p-7 bg-gradient-to-br from-zinc-900/50 to-transparent border border-white/[0.03] rounded-[36px] relative overflow-hidden group">
        {/* Subtle Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
        
        <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-blue-500" />
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic">Clinical Biography</h4>
        </div>

        <p className="text-[13px] text-zinc-400 leading-[1.8] font-medium max-w-[95%]">
          {doctor.bio || "System Notice: No professional biography has been indexed for this medical professional yet."}
        </p>

        {/* Metadata Footer */}
        <div className="mt-6 pt-6 border-t border-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${doctor.isActive ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Status: {doctor.isActive ? 'Verified Active' : 'On-Hold'}
                </span>
            </div>
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter italic">MedFlow OS Registry v2.0</span>
        </div>
      </div>
    </div>
  );
}