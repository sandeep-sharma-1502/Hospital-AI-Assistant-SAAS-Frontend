import React from 'react';
import { motion } from 'framer-motion';
import { X, Bot, User, Calendar, Clock } from 'lucide-react';

export default function SessionDetails({ session, onClose }) {
  if (!session) return null;

  // Mock conversation data
  const transcript = [
    { role: 'bot', text: "Hello! I'm MedFlow AI. How can I help you today?" },
    { role: 'user', text: "I've been having a persistent cough for 3 days." },
    { role: 'bot', text: "I'm sorry to hear that. Do you have a fever or any chest pain?" },
    { role: 'user', text: "No fever, but a little bit of tightness in my chest." },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase">
                {session.id}
              </span>
              <span className="text-xs text-slate-400 font-medium">Session Log</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{session.patientName}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Info Bar */}
        <div className="bg-slate-50 px-6 py-3 flex gap-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar size={14} /> {session.startTime}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock size={14} /> {session.duration}
          </div>
        </div>

        {/* Transcript Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {transcript.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                msg.role === 'bot' 
                ? 'bg-white border border-slate-100 text-slate-700 shadow-sm' 
                : 'bg-blue-600 text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
            Download PDF Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}