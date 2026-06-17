'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Folder } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { proyectoService, Proyecto } from '@/services/proyectoService';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRol, setUserRol] = useState('');
  
  // Estados para la API de negocio
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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
      
      // Cargar datos del BFF v2
      proyectoService.obtenerTodos()
        .then((data) => setProyectos(data))
        .catch((err) => console.error("Error cargando proyectos del BFF:", err))
        .finally(() => setLoadingData(false));
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

        {/* Grid de Estadísticas Dinámicas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-zinc-400">Proyectos Activos</h3>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              {loadingData ? '...' : proyectos.length}
            </p>
          </div>
        </div>

        {/* Sección de Lista de Proyectos v2 */}
        <h2 className="text-xl font-bold mb-4 tracking-tight">Proyectos en Ejecución (v2)</h2>
        
        {loadingData ? (
          <div className="flex py-10 justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          </div>
        ) : proyectos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500 text-sm">
            No hay proyectos disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {proyectos.map((proyecto, idx) => (
              <div key={proyecto.id || idx} className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-5 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-semibold text-zinc-200">{proyecto.nombre}</h4>
                </div>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{proyecto.descripcion}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 border border-zinc-700">
                    {proyecto.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}