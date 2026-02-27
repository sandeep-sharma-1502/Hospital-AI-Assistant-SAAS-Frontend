import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Pipecat AI Imports
import { PipecatClient } from "@pipecat-ai/client-js";
import { PipecatClientProvider, PipecatClientAudio } from "@pipecat-ai/client-react";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";

// Redux Actions
import { syncTheme } from './store/slices/themeSlice';

// Page & Layout Imports
import AssistantPage from './app/public/AssistantPage';
import DashboardPage from './app/admin/DashboardPage';
import SessionsPage from './app/admin/SessionsPage';
import KnowledgePage from './app/admin/KnowledgePage';
import AppointmentsPage from './app/admin/AppointmentsPage';
import LoginPage from './app/admin/LoginPage';
import AdminLayout from './shared/layout/AdminLayout';
import PublicLayout from './shared/layout/PublicLayout';
import NotFound from './app/NotFound';

// 1. Initialize Pipecat Client
const client = new PipecatClient({
  transport: new SmallWebRTCTransport({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  }),
  enableMic: true,
  enableCam: false,
});

export default function App() {
  const dispatch = useDispatch();
  
  // Auth state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 2. Sync Theme on Initial Load
  useEffect(() => {
    dispatch(syncTheme());
  }, [dispatch]);

  return (
    <PipecatClientProvider client={client}>
      <Router>
        <Routes>
          
          {/* --- Public / Patient Interface --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<AssistantPage />} />
          </Route>

          {/* --- Admin Login --- */}
          {/* Agar user pehle se login hai, toh use login page ki bajaye dashboard bhejo */}
          <Route 
            path="/admin/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/admin/dashboard" replace />} 
          />
          
          {/* --- Admin Protected Section --- */}
          {/* Yahan hum check kar rahe hain: Agar authenticated hai toh layout dikhao, varna login par bhej do */}
          <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
          </Route>

          {/* --- 404 Handling --- */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </Router>

      {/* Required for Voice AI to output sound */}
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}