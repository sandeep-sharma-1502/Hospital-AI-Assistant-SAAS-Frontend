import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

// Map DB session to frontend shape
const mapSession = (s) => {
  const start = s.startedAt ? new Date(s.startedAt) : null;
  const end   = s.endedAt   ? new Date(s.endedAt)   : null;

  let duration = 'Live';
  if (start && end) {
    const secs = Math.round((end - start) / 1000);
    const m = Math.floor(secs / 60);
    const sec = secs % 60;
    duration = m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  }

  return {
    id:          s.id,
    patientName: s.patient?.name || 'Anonymous',
    patientId:   s.patientId,
    startTime:   start
      ? start.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : '—',
    duration,
    status:      s.isFlagged    ? 'flagged'
               : s.status === 'ACTIVE' ? 'active'
               : 'completed',
    type:        s.type,
    summary:     s.summary || (s.logs?.[0]?.message?.slice(0, 60) || 'AI conversation session'),
    logs:        (s.logs || []).map((l) => ({
      role:    l.role === 'USER' ? 'user' : 'bot',
      text:    l.message,
      time:    new Date(l.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      type:    l.type,
      toolName: l.toolName,
    })),
  };
};

export const useSessions = (filters = {}) => {
  const [sessions, setSessions] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading]   = useState(true);

  const loadSessions = async (overrideFilters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...overrideFilters };
      const res = await apiClient.get('/sessions', { params });
      const raw = res.data?.data?.sessions || res.data?.data || [];
      setSessions(raw.map(mapSession));
      setMeta(res.data?.data?.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      console.error('Failed to load sessions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSessions(); }, [filters.page, filters.status]);

  return { sessions, meta, loading, refresh: loadSessions };
};