import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



// Redux Actions
import { syncTheme } from './store/slices/themeSlice';
import { checkAuth, getUserData } from './store/slices/userAuthSlice';
import { checkAdminAuth } from './store/slices/authSlice';

// Page & Layout Imports
import AssistantPage from './app/public/AssistantPage';
import DashboardPage from './app/admin/DashboardPage';
import SessionsPage from './app/admin/SessionsPage';
import KnowledgePage from './app/admin/KnowledgePage';
import AppointmentsPage from './app/admin/AppointmentsPage';
import DepartmentsPage from './app/admin/DepartmentsPage';
import LoginPage from './features/auth/pages/LoginPage';
import AdminLoginPage from './app/admin/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import VerifyEmailPage from './features/auth/pages/VerifyEmailPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import AdminLayout from './shared/layout/AdminLayout';
import PublicLayout from './shared/layout/PublicLayout';
import NotFound from './app/NotFound';
import DoctorsPage from './app/admin/DoctorsPage';
import AdminForgotPasswordPage from './app/admin/auth/AdminForgotPasswordPage';
import AdminResetPasswordPage from './app/admin/auth/AdminResetPasswordPage';
import AdminVerifyEmailPage from './app/admin/auth/AdminVerifyEmailPage';
import { Toaster } from 'react-hot-toast';

// 1. Initialize Pipecat Client
// const client = new PipecatClient({
//   transport: new SmallWebRTCTransport({
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   }),
//   enableMic: true,
//   enableCam: false,
// });



export default function App() {
  const dispatch = useDispatch();

  // Auth states from Redux
  const { isAuthenticated: isUserAuth, user: userData, isAccountVerified } = useSelector((state) => state.userAuth);
  const { isAuthenticated: isAdminAuth, user: adminData, isInitialized: isAdminInitialized } = useSelector((state) => state.adminAuth);
  const isAdminVerified = adminData?.isAccountVerified ?? false;

  // 1. Initial Checks
  useEffect(() => {
    dispatch(syncTheme());
    
    // Always check both auth states on mount to ensure frontend is synced with cookies
    dispatch(checkAdminAuth());
    dispatch(checkAuth());
  }, [dispatch]);

  // 2. Fetch User Data if User Authenticated
  useEffect(() => {
    if (isUserAuth) {
      dispatch(getUserData());
    }
  }, [isUserAuth, dispatch]);

  // ✅ Don't render route guards until the admin auth check has completed.
  // This prevents a flash-redirect caused by isAdminVerified being undefined.
  if (!isAdminInitialized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main, #0f172a)' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #334155', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>

          {/* --- Public / Patient Interface --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<AssistantPage />} />
          </Route>

          {/* --- User Authentication Routes --- */}
          <Route
            path="/login"
            element={!isUserAuth ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!isUserAuth ? <RegisterPage /> : <Navigate to="/verify-email" replace />}
          />
          <Route
            path="/verify-email"
            element={isUserAuth && !isAccountVerified ? <VerifyEmailPage /> : <Navigate to="/" replace />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* --- Admin Authentication --- */}
          <Route
            path="/admin/login"
            element={!isAdminAuth ? <AdminLoginPage /> : <Navigate to="/admin/dashboard" replace />}
          />
          <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
          <Route
            path="/admin/verify-email"
            element={
              !isAdminAuth
                ? <Navigate to="/admin/login" replace />
                : isAdminVerified
                  ? <Navigate to="/admin/dashboard" replace />
                  : <AdminVerifyEmailPage />
            }
          />

          {/* --- Admin Protected Section --- */}
          <Route
            path="/admin"
            element={
              !isAdminAuth
                ? <Navigate to="/admin/login" replace />
                : !isAdminVerified
                  ? <Navigate to="/admin/verify-email" replace />
                  : <AdminLayout />
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />

          </Route>

          {/* --- 404 Handling --- */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>

    </>
  );
}