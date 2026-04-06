import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';
import toast from 'react-hot-toast';

export const useKnowledge = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocs = async () => {
    setLoading(true);
    try {
      // ✅ Matches the updated GET /api/v1/admin/knowledge/list
      const res = await apiClient.get('/admin/knowledge/list');
      const raw = res.data?.data || [];
      setDocs(raw.map((d) => ({
        id:       d.docId,        // The new docId format (e.g. doc_1234_xxx)
        name:     d.title || d.fileName,  // Extracted title or filename
        size:     d.pagesCount ? `${d.pagesCount} pages` : '—', // Instead of KB, display page count
        date:     d.uploadedAt
          ? new Date(d.uploadedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
          : '—',
        builtIn:  false, // Custom logic if needed later
      })));
    } catch (err) {
      setError(err);
      toast.error('Failed to load knowledge base.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) throw new Error('No file provided');
    setUploading(true);
    
    // Create form data for multipart upload
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, '')); // Name without extension
    
    // Show a loading toast that we can dismiss later
    const toastId = toast.loading('Uploading and chunking document...');
    
    try {
      // ✅ Matches the POST /api/v1/admin/knowledge/upload endpoint
      const res = await apiClient.post('/admin/knowledge/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newDoc = res.data?.data;
      if (newDoc) {
        setDocs((prev) => [{
          id:       newDoc.docId,
          name:     newDoc.title,
          size:     newDoc.pagesCount ? `${newDoc.pagesCount} pages` : '—',
          date:     new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
        }, ...prev]);
        toast.success(res.data?.message || 'Document indexed successfully!', { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.', { id: toastId });
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const removeDoc = async (id) => {
    try {
      // ✅ Matches the DELETE /api/v1/admin/knowledge/:docId endpoint
      await apiClient.delete(`/admin/knowledge/${id}`);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      toast.success('Document removed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove document');
    }
  };

  useEffect(() => { loadDocs(); }, []);

  // Return exactly what the provided KnowledgePage.jsx expects
  return { docs, loading, uploading, error, handleUpload, removeDoc, refresh: loadDocs };
};