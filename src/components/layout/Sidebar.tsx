'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FolderCanvas, LogOut } from 'lucide-react';

interface SidebarProps {
  userEmail: string;
  userRol: string;
}

export default function Sidebar({ userEmail, userRol }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0">
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          InnovaTech v2
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Rol: {userRol}</p>
        
        <nav className="mt-8 space-y-2">
          <a href="#" className="flex items-center gap-3 rounded-lg bg-indigo-600/10 px-4 py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/10">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all">
            <FolderCanvas className="h-4 w-4" /> Proyectos
          </a>
        </nav>
      </div>

      <div>
        <div className="mb-4 border-t border-zinc-800 pt-4 text-xs text-zinc-400 truncate">
          {userEmail}
        </div>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 border border-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}