import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Bell, Search, Command, ShieldCheck } from 'lucide-react';
import { toggleTheme } from "../../store/slices/themeSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const { user } = useSelector((state) => state.adminAuth);

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/[0.04] transition-all duration-300">

      {/* ---------------- LEFT: SEARCH BOX ---------------- */}
      <div className="hidden md:flex items-center gap-4 bg-white/[0.02] px-5 py-2.5 rounded-2xl border border-white/[0.05] w-[420px] group focus-within:border-blue-500/40 focus-within:bg-white/[0.04] transition-all shadow-2xl">
        <Search size={16} className="text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search encrypted records..."
          className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-wider w-full text-zinc-300 placeholder:text-zinc-700"
        />
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0c0c0e] border border-white/[0.08] text-[9px] font-black text-zinc-500 shadow-inner">
          <Command size={10} /> K
        </div>
      </div>

      {/* ---------------- RIGHT: ACTIONS ---------------- */}
      <div className="flex items-center gap-6">

        {/* Quick Stats / Status (Optional Premium Touch) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest text-nowrap">System Secure</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-zinc-500 hover:text-blue-500 hover:border-blue-500/30 transition-all active:scale-90 group"
          >
            {isDarkMode ? <Sun size={18} className="group-hover:rotate-90 transition-transform duration-500" /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.05] text-zinc-500 hover:text-zinc-200 transition-all relative group overflow-hidden">
            <Bell size={18} />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-600 rounded-full border-2 border-[#09090b] shadow-[0_0_8px_rgba(37,99,235,0.8)]"></span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/[0.04]">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-white uppercase tracking-[0.15em] leading-none">
              {user?.name || "Sandeep Sharma"}
            </p>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
              <ShieldCheck size={10} className="text-blue-600" /> Root Auth
            </p>
          </div>

          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-[18px] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center text-white text-xs font-black shadow-2xl group-hover:border-blue-500/50 transition-all">
              {user?.name?.[0] || "S"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[#09090b] rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}