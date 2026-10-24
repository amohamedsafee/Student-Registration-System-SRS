import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Button } from '../../components/ui';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Overview & Stats', path: '/admin', icon: <LayoutDashboard size={18} />, end: true },
    { label: 'Review Registrations', path: '/admin/registrations', icon: <Users size={18} /> },
    { label: 'Courses Management', path: '/admin/courses', icon: <BookOpen size={18} /> },
    { label: 'Batches & Schedules', path: '/admin/batches', icon: <Calendar size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg)', color: 'var(--text-main)' }}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-[3px] border-[#182B5E] shadow-[0_4px_0_0_#182B5E]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#182B5E] text-white flex items-center justify-center font-black text-sm border-2 border-[#182B5E]">
            LLC
          </div>
          <span className="font-black text-[#182B5E] text-sm uppercase tracking-wider">
            Admin Console
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 border-2 border-[#182B5E] bg-[#F7F9FC]"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-white border-r-[3px] border-[#182B5E] flex flex-col justify-between p-6 transition-transform duration-200 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Badge */}
          <div className="pb-6 border-b-2 border-[#182B5E]">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#182B5E] text-white flex items-center justify-center font-black text-lg border-2 border-[#182B5E] shadow-[3px_3px_0px_0px_#182B5E]">
                LLC
              </div>
              <div>
                <span className="font-black text-[#182B5E] text-base leading-none block">
                  Language Campus
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D9381E]">
                  Admissions Portal
                </span>
              </div>
            </Link>

            <div className="mt-4 flex items-center gap-2 bg-[#F7F9FC] border-2 border-[#182B5E] p-2 text-xs font-bold text-[#182B5E]">
              <Shield size={16} className="text-[#D9381E]" />
              <div className="truncate">
                <span className="block text-[10px] uppercase text-[#5A6B8C]">Logged in as</span>
                <span className="truncate block">{user?.email || 'Administrator'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#5A6B8C] px-2 block">
              Administration Modules
            </span>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                    isActive
                      ? 'bg-[#182B5E] text-white border-[#182B5E] shadow-[4px_4px_0px_0px_#D9381E]'
                      : 'bg-white text-[#182B5E] border-transparent hover:border-[#182B5E] hover:bg-[#F7F9FC]'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t-2 border-[#182B5E] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#5A6B8C] hover:text-[#182B5E] border border-transparent hover:border-[#182B5E]"
          >
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            iconLeading={<LogOut size={16} />}
            className="w-full justify-center"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
