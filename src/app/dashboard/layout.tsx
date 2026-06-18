'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}