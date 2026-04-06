import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AdminLayout() {
  return (
    // Base: OLED Black (#09090b)
    <div className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-600 dark:text-zinc-400 selection:bg-blue-500/30 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR: Zero gap layout for a solid desk feel */}
      <Sidebar />
      
      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Subtle Glow behind Navbar for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-50" />
        
        {/* Navbar: Sticky & Blurred */}
        <Navbar />
        
        {/* 3. SCROLLABLE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50 dark:bg-[#09090b]">
          
          {/* Linear-style Background Gradient (Very Subtle) */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none" />
          
          {/* Main Content Wrapper */}
          <div className="max-w-[1600px] mx-auto relative">
            {/* Animation: Slide and Fade for page transitions 
               Note: 'animate-in' requires 'tailwindcss-animate' plugin
            */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <Outlet />
            </div>
          </div>

          {/* Optional: Footer or Copyright text bottom of scroll */}
          <footer className="p-8 mt-auto flex justify-center opacity-20 hover:opacity-100 transition-opacity duration-500">
             <p className="text-[10px] font-black uppercase tracking-[0.5em]">MedFlow OS • v1.0.4</p>
          </footer>
        </main>

      </div>
    </div>
  );
}