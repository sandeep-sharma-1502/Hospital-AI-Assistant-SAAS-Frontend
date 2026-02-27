import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  CalendarCheck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Stethoscope 
} from 'lucide-react';

// Redux Action
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Sessions', path: '/admin/sessions', icon: MessageSquare },
  { name: 'Knowledge', path: '/admin/knowledge', icon: Database },
  { name: 'Appointments', path: '/admin/appointments', icon: CalendarCheck },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout Functionality
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate('/admin/login');
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-[var(--card)] text-[var(--text-secondary)] flex flex-col sticky top-0 border-r border-[var(--border-subtle)] transition-all duration-300 ease-in-out z-20"
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-[var(--border-subtle)] overflow-hidden">
        <div className="min-w-[40px] w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
          <Stethoscope size={22} />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-[var(--text-primary)] text-lg tracking-tight whitespace-nowrap"
          >
            MedFlow <span className="text-blue-500">OS</span>
          </motion.span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)]'
              }`}
            >
              <item.icon 
                size={20} 
                className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'group-hover:text-blue-500'}`} 
              />
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
              
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="activePill"
                  className="absolute left-[-16px] w-1.5 h-6 bg-blue-600 rounded-r-full" 
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[var(--border-subtle)] space-y-2 bg-[var(--card)]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-bold group text-red-400"
        >
          <LogOut size={20} className="shrink-0 group-hover:rotate-12 transition-transform" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}