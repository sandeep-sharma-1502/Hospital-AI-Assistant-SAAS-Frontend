import { useState } from 'react';
import { uploadDocument } from '../services/knowledgeApi';

export const useKnowledge = () => {
  const [docs, setDocs] = useState([
    { id: '1', name: 'Hospital_Guidelines_2026.pdf', size: '1.2 MB', status: 'indexed', date: 'Feb 20, 2026' },
    { id: '2', name: 'Emergency_Protocols.docx', size: '850 KB', status: 'indexed', date: 'Feb 22, 2026' }
  ]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const newDoc = await uploadDocument(file);
      setDocs(prev => [newDoc, ...prev]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return { docs, uploading, handleUpload };
};