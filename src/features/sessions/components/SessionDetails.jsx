import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bot, User, Calendar, Clock, Wrench, AlertTriangle, Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

export default function SessionDetails({ session, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!session) return null;

  const logs = session.logs || [];

  const contentRef = useRef(null);
  
  const handleDownloadPdf = useReactToPrint({
    contentRef,
    documentTitle: `Session_Report_${session.id?.slice(0, 8)}`,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className="flex flex-col h-full bg-white relative w-full print:p-8">
        <style type="text/css" media="print">
          {`@page { size: auto;  margin: 10mm; }`}
        </style>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded-lg uppercase tracking-wide">
                {session.type || 'CHAT'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Session Transcript</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{session.patientName}</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{session.id?.slice(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-400 print:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Info Bar */}
        <div className="bg-slate-50 px-6 py-3 flex gap-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar size={13} /> {session.startTime}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock size={13} /> {session.duration}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-bold">{logs.length}</span> messages
          </div>
        </div>

        {/* Summary */}
        {session.summary && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 shrink-0">
            <p className="text-xs text-blue-700 font-medium italic">💡 {session.summary}</p>
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {logs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">No conversation logs for this session.</p>
            </div>
          ) : (
            logs.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'bot'  ? 'bg-blue-100 text-blue-600' :
                  msg.type === 'TOOL_CALL' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {msg.type === 'TOOL_CALL' ? <Wrench size={14} /> :
                   msg.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Bubble */}
                <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : msg.type === 'TOOL_CALL'
                      ? 'bg-amber-50 border border-amber-200 text-amber-800 rounded-bl-sm'
                      : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-sm'
                  }`}>
                    {msg.type === 'TOOL_CALL' && (
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
                        🛠 Tool: {msg.toolName}
                      </p>
                    )}
                    {msg.text}
                  </div>
                  {msg.time && (
                    <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0 print:hidden">
          <button
            className="w-full bg-slate-900 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            onClick={handleDownloadPdf}
          >
            <Printer size={16} />
            Download or Print PDF
          </button>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}