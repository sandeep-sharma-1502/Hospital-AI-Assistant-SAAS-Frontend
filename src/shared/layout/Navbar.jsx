import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Bell, Search } from 'lucide-react';
import { toggleTheme } from "../../store/slices/themeSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <header className="h-20 bg-[var(--card)] border-b border-[var(--border-subtle)] px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      {/* Search Bar (Optional UI touch) */}
      <div className="hidden md:flex items-center gap-3 bg-[var(--bg-main)] px-4 py-2 rounded-2xl border border-[var(--border-subtle)] w-96">
        <Search size={18} className="text-[var(--text-secondary)]" />
        <input 
          type="text" 
          placeholder="Search patients, records..." 
          className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-primary)]"
        />
      </div>

      <div className="flex items-center gap-5">
        {/* ✨ THEME TOGGLE BUTTON - Now Visible! */}
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-blue-600 transition-all active:scale-95 shadow-sm"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--card)]"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-5 border-l border-[var(--border-subtle)]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[var(--text-primary)]">Dr. Aman</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none">
            A
          </div>
        </div>
      </div>
    </header>
  );
}