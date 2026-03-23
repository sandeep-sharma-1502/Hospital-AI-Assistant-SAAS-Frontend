import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Trash2, Search, Database,
  CheckCircle2, RefreshCw, AlertCircle, Plus, X, Lock
} from 'lucide-react';
import { useKnowledge } from '../../features/knowledge/hooks/useKnowledge';

const CATEGORY_COLORS = {
  general:     'bg-blue-50 text-blue-600 border-blue-100',
  departments: 'bg-purple-50 text-purple-600 border-purple-100',
  policy:      'bg-amber-50 text-amber-600 border-amber-100',
  emergency:   'bg-red-50 text-red-600 border-red-100',
  pricing:     'bg-emerald-50 text-emerald-600 border-emerald-100',
  custom:      'bg-slate-50 text-slate-600 border-slate-100',
};

export default function KnowledgePage() {
  const { docs, loading, uploading, handleUpload, handleDelete, refresh } = useKnowledge();

  const [searchQuery, setSearchQuery]   = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [form, setForm] = useState({ name: '', category: 'custom', content: '' });
  const [formError, setFormError] = useState('');

  const filteredDocs = docs.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.content.trim()) {
      setFormError('Name and content are required.');
      return;
    }
    try {
      await handleUpload(form);
      setShowModal(false);
      setForm({ name: '', category: 'custom', content: '' });
    } catch (err) {
      setFormError(err.message || 'Upload failed.');
    }
  };

  const confirmDelete = async (id) => {
    try {
      await handleDelete(id);
    } catch (err) {
      alert(err.message || 'Cannot delete built-in document.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 font-sans">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white"><Database size={16} /></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">RAG System</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage hospital knowledge used by the AI assistant for accurate responses.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Filter sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-60 shadow-sm"
            />
          </div>
          <button
            onClick={refresh}
            className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:border-blue-300 transition-all shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={18} /> Add Knowledge
          </button>
        </div>
      </div>

      {/* ── STAT STRIP ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Docs',   value: docs.length,                                   color: 'blue'   },
          { label: 'Built-in',     value: docs.filter(d => d.builtIn).length,            color: 'purple' },
          { label: 'Custom',       value: docs.filter(d => !d.builtIn).length,           color: 'amber'  },
          { label: 'All Indexed',  value: docs.filter(d => d.status === 'indexed').length, color: 'emerald'},
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-5 flex items-center gap-3">
            <div className={`w-2 h-10 rounded-full ${
              stat.color === 'blue'   ? 'bg-blue-500'   :
              stat.color === 'purple' ? 'bg-purple-500' :
              stat.color === 'amber'  ? 'bg-amber-500'  : 'bg-emerald-500'
            }`} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── DOC LIST ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">
          Indexed Documents ({filteredDocs.length})
        </h3>

        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin mx-auto text-blue-400" size={32} />
            <p className="text-slate-400 text-sm mt-3">Loading knowledge base...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredDocs.map((doc) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={doc.id}
                  className="p-5 bg-white rounded-[24px] border border-slate-200 flex items-start justify-between group hover:shadow-xl hover:shadow-slate-100 transition-all"
                >
                  <div className="flex items-start gap-4 overflow-hidden flex-1">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <FileText size={22} />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0">
                      <p className="text-slate-900 font-bold text-sm truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wide ${CATEGORY_COLORS[doc.category] || CATEGORY_COLORS.custom}`}>
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{doc.size}</span>
                        <span className="text-[10px] font-bold text-slate-400">{doc.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="hidden group-hover:flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl uppercase">
                      <CheckCircle2 size={11} /> Live
                    </span>
                    {doc.builtIn ? (
                      <span className="p-2.5 text-slate-200" title="Built-in document">
                        <Lock size={16} />
                      </span>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(doc.id)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredDocs.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
            <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No documents found.</p>
          </div>
        )}
      </div>

      {/* ── ADD KNOWLEDGE MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900">Add Knowledge Document</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Document Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. COVID-19 Protocol 2026"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="custom">Custom</option>
                    <option value="general">General Info</option>
                    <option value="departments">Departments</option>
                    <option value="policy">Policy</option>
                    <option value="emergency">Emergency</option>
                    <option value="pricing">Pricing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Content *</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Paste the knowledge content here. This will be injected into the AI context when relevant..."
                    rows={7}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <AlertCircle size={13} /> {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {uploading ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : <><Plus size={16} /> Add to Knowledge Base</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.93 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={26} className="text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete Document?</h3>
              <p className="text-slate-500 text-sm mb-6">This document will be removed from the AI knowledge base immediately.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button onClick={() => confirmDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}