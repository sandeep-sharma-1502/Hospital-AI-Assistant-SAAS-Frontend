import React from "react";
import { motion } from "framer-motion";
import { User, Bot, Stethoscope, Calendar, CheckCircle2 } from "lucide-react";

// ─── Tool Action Cards ────────────────────────────────────────────────────────
function DoctorsCard({ data }) {
  if (!data?.length) return <p className="text-sm text-zinc-400">No doctors found.</p>;
  return (
    <div className="space-y-2 mt-2">
      {data.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 bg-zinc-700/50 rounded-xl px-3 py-2 border border-zinc-600/40">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
            <Stethoscope size={14} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{doc.name}</p>
            <p className="text-[10px] text-zinc-400">{doc.specialization}</p>
          </div>
          <span className="ml-auto text-[10px] text-zinc-500 font-mono">ID:{doc.id}</span>
        </div>
      ))}
    </div>
  );
}

function SlotsCard({ data }) {
  const getTime = (mins) => {
    const h = Math.floor(mins / 60), m = mins % 60;
    const ap = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ap}`;
  };
  if (!data?.length) return <p className="text-sm text-zinc-400">No available slots.</p>;
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {data.map((slot) => (
        <div key={slot.id} className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl px-3 py-2">
          <Calendar size={12} className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-300">{getTime(slot.startTime)}</p>
            <p className="text-[10px] text-zinc-500">ID:{slot.id}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppointmentCard({ data }) {
  return (
    <div className="flex items-center gap-3 mt-2 bg-emerald-600/10 border border-emerald-500/20 rounded-xl px-4 py-3">
      <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
      <div>
        <p className="text-sm font-bold text-emerald-300">Appointment Confirmed!</p>
        <p className="text-[10px] text-zinc-400">ID: {data?.appointment?.id || data?.id}</p>
      </div>
    </div>
  );
}

function ActionBubble({ action, data }) {
  const labels = { GET_DOCTORS: "Available Doctors", GET_SLOTS: "Available Slots", BOOK_APPOINTMENT: "Booking Confirmed" };
  return (
    <div className="max-w-[85%] bg-zinc-800/80 border border-zinc-700/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">{labels[action] || action}</p>
      {action === "GET_DOCTORS" && <DoctorsCard data={data} />}
      {action === "GET_SLOTS" && <SlotsCard data={data} />}
      {action === "BOOK_APPOINTMENT" && <AppointmentCard data={data} />}
    </div>
  );
}

// ─── Main Message Bubble ──────────────────────────────────────────────────────
export default function MessageBubble({ role, text, action, data }) {
  const isUser = role === "user";
  const isAction = role === "action";

  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className={`w-7 h-7 flex items-center justify-center rounded-full shrink-0 shadow-sm mb-1 ${isAction ? "bg-emerald-600" : "bg-blue-600"}`}>
          {isAction ? <CheckCircle2 size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
        </div>
      )}

      {/* Content */}
      {isAction ? (
        <ActionBubble action={action} data={data} />
      ) : (
        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-zinc-800 text-zinc-100 border border-zinc-700/50 rounded-bl-sm"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          <span className={`text-[10px] block mt-1 opacity-40 ${isUser ? "text-right" : "text-left"}`}>{timestamp}</span>
        </div>
      )}

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 bg-zinc-600 flex items-center justify-center rounded-full shrink-0 shadow-sm mb-1">
          <User size={14} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}
