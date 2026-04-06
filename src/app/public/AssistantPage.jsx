// src/app/public/AssistantPage.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import VoiceBot from '../../features/assistant/components/VoiceBot';
import { logout } from '../../store/slices/userAuthSlice';
import { LogOut, User as UserIcon, LogIn } from 'lucide-react';

export default function AssistantPage() {
  const { isAuthenticated, user, isAccountVerified } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();

  return (
    <div className="h-[100dvh] bg-gray-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <span className="font-bold text-gray-800 dark:text-white uppercase tracking-wider text-sm">Hospital Assistant</span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{user?.name}</span>
                {!isAccountVerified && (
                  <Link to="/verify-email" title="title" className="text-[10px] text-red-500 font-bold hover:underline">Unverified Account</Link>
                )}
              </div>
              <button 
                onClick={() => dispatch(logout())}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              title="title"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <VoiceBot />
      </main>
    </div>
  );
}
