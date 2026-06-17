'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRol, setUserRol] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const rol = localStorage.getItem('userRol');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setUserEmail(email || '');
      setUserRol(rol || '');
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <Sidebar userEmail={userEmail} userRol={userRol} />

      <main className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Bienvenido al Panel</h1>
          <p className="text-zinc-400 mt-1">Gestión integral de microservicios y recursos de InnovaTech.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-zinc-400">Proyectos Activos</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight">0</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-zinc-400">Recursos Asignados</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}