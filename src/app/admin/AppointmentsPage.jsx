import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MoreVertical, 
  Calendar as CalendarIcon, 
  Mic, 
  MicOff, 
  Filter, 
  User, 
  CheckCircle2, 
  Clock,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const APPOINTMENTS_DATA = [
  { id: 'APT-001', patient: 'Sarah Connor', dr: 'Dr. Aris', date: '2026-03-15', status: 'Confirmed', time: '10:30 AM' },
  { id: 'APT-002', patient: 'James Holden', dr: 'Dr. Nagata', date: '2026-03-16', status: 'Pending', time: '12:00 PM' },
  { id: 'APT-003', patient: 'Ellen Ripley', dr: 'Dr. Ash', date: '2026-03-14', status: 'Cancelled', time: '02:45 PM' },
];

export default function AppointmentsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // 🎙️ Mic & Visualizer State
  const [isMicStarted, setIsMicStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true); 
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const [audioData, setAudioData] = useState(new Array(10).fill(2));

  // 🎤 Start Mic & Setup Visualizer
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = false; // Initial Mute

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64; 
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      setIsMicStarted(true);
      setIsMuted(true);

      visualize();
      toast.success("Joined Voice Channel", { icon: '🎙️' });
    } catch (err) {
      console.error("Mic Error:", err);
      toast.error("Microphone access denied.");
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const update = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Mute Detection Logic
      if (average > 40 && isMuted) {
        toast("You are muted!", { id: 'mute-warn', icon: '⚠️', duration: 1000 });
      }

      const simplifiedData = Array.from(dataArray.slice(0, 10)).map(v => Math.max(3, v / 6));
      setAudioData(simplifiedData);
      animationRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const toggleMute = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    const newState = !audioTrack.enabled;
    audioTrack.enabled = newState;
    setIsMuted(!newState);
    toast(newState ? "Mic Active" : "Mic Muted", { 
      icon: newState ? '🎙️' : '🔇',
      style: { borderRadius: '12px', background: '#333', color: '#fff' }
    });
  };

  const stopMicCompletely = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    
    setIsMicStarted(false);
    setIsMuted(true);
    setAudioData(new Array(10).fill(2));
    toast("Left Voice Channel");
  };

  useEffect(() => {
    return () => stopMicCompletely();
  }, []);

  const filteredData = APPOINTMENTS_DATA.filter(item => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch = item.patient.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Appointments</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage hospital visits and voice consultations.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-[24px] border border-slate-200 shadow-sm">
          {/* Visualizer */}
          {isMicStarted && !isMuted && (
            <div className="flex items-center gap-1.5 h-10 px-4 bg-blue-50 rounded-2xl border border-blue-100">
              {audioData.map((val, i) => (
                <motion.div
                  key={i}
                  animate={{ height: val }}
                  className="w-1.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48 md:w-64 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Voice Controls */}
          {!isMicStarted ? (
            <button onClick={startMic} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
              <Mic size={18} /> Join Channel
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all active:scale-95 ${
                  isMuted ? "bg-rose-500 shadow-rose-200" : "bg-emerald-500 shadow-emerald-200"
                } shadow-lg`}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                {isMuted ? "Unmute" : "Live"}
              </button>
              <button onClick={stopMicCompletely} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- STATS & FILTERS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === status ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">
          Showing {filteredData.length} records
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Physician</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {filteredData.map((apt) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={apt.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {apt.patient.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{apt.patient}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{apt.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <User size={14} className="text-slate-300" /> {apt.dr}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CalendarIcon size={14} className="text-blue-500" /> {apt.date}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <Clock size={12} /> {apt.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${
                      apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      apt.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {apt.status === 'Confirmed' && <CheckCircle2 size={12} />}
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">No appointments match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}