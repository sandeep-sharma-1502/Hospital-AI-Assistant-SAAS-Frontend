import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

export const useKnowledge = () => {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState(null);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res  = await apiClient.get('/admin/knowledge');
      const raw  = res.data?.data || res.data || [];
      setDocs(raw.map((d) => ({
        id:       d.id,
        name:     d.name,
        category: d.category,
        size:     d.content ? `${(d.content.length / 1024).toFixed(1)} KB` : '—',
        status:   d.isActive ? 'indexed' : 'inactive',
        date:     d.createdAt
          ? new Date(d.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
          : '—',
        builtIn:  !d.id.startsWith('custom'),
      })));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ name, category, content }) => {
    if (!name?.trim() || !content?.trim()) throw new Error('Name and content required');
    setUploading(true);
    try {
      const res = await apiClient.post('/admin/knowledge/upload', { name, category, content });
      const newDoc = res.data?.data;
      if (newDoc) {
        setDocs((prev) => [{
          id:       newDoc.id,
          name:     newDoc.name,
          category: newDoc.category,
          size:     `${(newDoc.content?.length / 1024 || 0).toFixed(1)} KB`,
          status:   'indexed',
          date:     new Date(newDoc.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }),
          builtIn:  false,
        }, ...prev]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await apiClient.delete(`/admin/knowledge/${id}`);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  useEffect(() => { loadDocs(); }, []);

  return { docs, loading, uploading, error, handleUpload, handleDelete, refresh: loadDocs };
};