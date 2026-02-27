import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Dummy login success - Asli logic hum backend mein banayenge
    const dummyUser = { name: "Dr. Aman", role: "Admin" };
    const dummyToken = "jwt-token-12345";

    // 1. Redux ko batayein ki hum login ho chuke hain
    dispatch(setCredentials({ user: dummyUser, token: dummyToken }));

    // 2. Dashboard par bhej dein
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
      <form onSubmit={handleLogin} className="bg-[var(--card)] p-8 rounded-3xl shadow-xl border border-[var(--border-subtle)] w-96">
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6 text-center">Admin Login</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)]" required />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)]" required />
          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}