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

export const useSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res  = await apiClient.get('/sessions');
      const raw  = res.data?.data || res.data || [];
      setSessions(raw.map(mapSession));
    } catch (error) {
      console.error('Failed to load sessions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSessions(); }, []);

  return { sessions, loading, refresh: loadSessions };
};