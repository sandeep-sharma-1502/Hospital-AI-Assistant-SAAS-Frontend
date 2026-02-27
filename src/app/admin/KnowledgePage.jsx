import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Search, 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

// Feature-based hooks (as per your structure)
import { useKnowledge } from '../../features/knowledge/hooks/useKnowledge';

export default function KnowledgePage() {
  const { docs, uploading, handleUpload, removeDoc } = useKnowledge();
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  // Filtering documents based on search
  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Database size={16} />
            </div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Training Data</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-slate-500 text-sm font-medium">Manage medical protocols and clinical documentation for RAG training.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Filter sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Upload size={18} /> Upload Doc
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />
        </div>
      </div>

      {/* 2. DRAG & DROP AREA / UPLOAD STATUS */}
      <motion.div 
        whileHover={{ scale: 1.005 }}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-[32px] p-12 bg-white flex flex-col items-center justify-center text-center group transition-all cursor-pointer ${
          uploading ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400'
        }`}
      >
        <div className={`w-20 h-20 rounded-[24px] shadow-sm flex items-center justify-center mb-4 transition-all ${
          uploading ? 'bg-blue-600 text-white animate-bounce' : 'bg-slate-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white'
        }`}>
          {uploading ? <RefreshCw className="animate-spin" size={32} /> : <Upload size={32} />}
        </div>
        
        {uploading ? (
          <div>
            <p className="text-blue-600 font-bold text-lg">Indexing Vector Database...</p>
            <p className="text-slate-400 text-sm mt-1">Chunking and embedding document metadata.</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-700 font-bold text-lg">Click or drag files to this area to upload</p>
            <p className="text-slate-400 text-sm mt-1 font-medium">Support for PDF, DOCX, TXT (Max 50MB per file)</p>
          </div>
        )}
      </motion.div>

      {/* 3. DOCUMENT LIST */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Indexed Sources ({filteredDocs.length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDocs.map((doc) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={doc.id} 
                className="p-5 bg-white rounded-[24px] border border-slate-200 flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-slate-900 font-bold text-sm truncate pr-4">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.size}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden group-hover:flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                    <CheckCircle2 size={12} /> Live
                  </div>
                  <button 
                    onClick={() => removeDoc(doc.id)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDocs.length === 0 && !uploading && (
          <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
              <AlertCircle size={32} />
            </div>
            <p className="text-slate-500 font-medium">No knowledge sources found. Start by uploading a protocol.</p>
          </div>
        )}
      </div>
    </div>
  );
}