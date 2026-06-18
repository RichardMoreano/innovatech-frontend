'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Folder, Users, UserPlus, Trash2 } from 'lucide-react';
import { proyectoService, Proyecto, DetalleProyecto } from '@/services/proyectoService';
import { recursoService, Recurso } from '@/services/recursoService';

export default function DashboardPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [recursosLibres, setRecursosLibres] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProyectoId, setSelectedProyectoId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<DetalleProyecto | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const esLibre = (r: Recurso) => {
    if (!r) return false;
    const disp = String(r.disponibilidad || '').toUpperCase();
    return disp === 'TRUE' || disp === 'DISPONIBLE' || (r as any).disponible === true;
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      const dataProyectos = await proyectoService.obtenerTodos();
      setProyectos(dataProyectos);
      
      const todosLosRecursos = await recursoService.obtenerTodos();
      setRecursosLibres(todosLosRecursos.filter(esLibre));
    } catch (err) {
      console.error("Error al cargar métricas del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarRecursosDisponibles = async () => {
    try {
      const todosLosRecursos = await recursoService.obtenerTodos();
      const libres = todosLosRecursos.filter(esLibre);
      setRecursosLibres(libres);
    } catch (err) {
      console.error("Error al mapear personal disponible:", err);
    }
  };

  const abrirProyecto = async (id: number) => {
    setSelectedProyectoId(id);
    setLoadingDetalle(true);
    try {
      const data = await proyectoService.obtenerDetalle(id);
      setDetalle(data);
    } catch (err) {
      console.error("Error cargando detalles:", err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!selectedProyectoId || !detalle) return;
    try {
      const updated = await proyectoService.actualizarEstado(selectedProyectoId, nuevoEstado);
      setDetalle({ ...detalle, estado: updated.estado });
      setProyectos(prev => prev.map(p => p.id === selectedProyectoId ? { ...p, estado: updated.estado } : p));
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const vincularRecurso = async (recursoId: number) => {
    if (!selectedProyectoId) return;
    try {
      // 1. Intentar la mutación en el servidor
      await proyectoService.asignarRecurso(selectedProyectoId, recursoId);
    } catch (err) {
      console.warn("El servidor respondió con error, intentando actualizar UI de igual forma:", err);
    } finally {
      // 2. Forzar actualización en la UI sin importar el resultado del endpoint
      await abrirProyecto(selectedProyectoId);
      await cargarRecursosDisponibles();
    }
  };

  const desvincularRecurso = async (recursoId: number) => {
    if (!selectedProyectoId) return;
    try {
      // 1. Intentar la mutación en el servidor
      await proyectoService.eliminarRecurso(selectedProyectoId, recursoId);
    } catch (err) {
      console.warn("El servidor respondió con error, intentando actualizar UI de igual forma:", err);
    } finally {
      // 2. Forzar actualización en la UI sin importar el resultado del endpoint
      await abrirProyecto(selectedProyectoId);
      await cargarRecursosDisponibles();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Bienvenido al Panel</h1>
          <p className="text-zinc-400 mt-1">Orquestación activa v2 — InnovaTech.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md">
          <h3 className="text-sm font-medium text-zinc-400">Proyectos Activos</h3>
          <p className="mt-2 text-3xl font-bold">{proyectos.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-md">
          <h3 className="text-sm font-medium text-zinc-400">Recursos Disponibles (Libres)</h3>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{recursosLibres.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Proyectos en Ejecución</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {proyectos.map((proyecto) => (
            <div 
              key={proyecto.id} 
              onClick={() => proyecto.id && abrirProyecto(proyecto.id)}
              className="group cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/20 p-5 hover:border-indigo-500/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">{proyecto.nombre}</h4>
                </div>
                <span className="text-xs px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-300">
                  {proyecto.estado}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{proyecto.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedProyectoId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setSelectedProyectoId(null); setDetalle(null); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100"
            >
              ✕
            </button>

            {loadingDetalle || !detalle ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
            ) : (
              <>
                <div>
                  <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">Detalles de Proyecto</span>
                  <h2 className="text-2xl font-bold mt-1">{detalle.nombre}</h2>
                  <p className="text-zinc-400 text-sm mt-2">{detalle.descripcion}</p>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <label className="text-xs font-medium text-zinc-400 block mb-2">Estado del Ciclo de Vida</label>
                  <div className="flex gap-2">
                    {['PLANIFICADO', 'EN_PROGRESO', 'COMPLETADO'].map((st) => (
                      <button
                        key={st}
                        onClick={() => cambiarEstado(st)}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-all ${
                          detalle.estado === st 
                            ? 'bg-indigo-600 border-indigo-500 text-white' 
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-zinc-300 flex items-center gap-2">
                      <Users className="h-4 w-4 text-zinc-400" /> Asignados ({detalle.recursosAsignados?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {detalle.recursosAsignados?.map((recurso) => (
                        <div key={recurso.id} className="flex items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                          <div>
                            <p className="text-xs font-medium text-zinc-200">{recurso.nombre}</p>
                            <p className="text-[10px] text-zinc-500">{recurso.rol}</p>
                          </div>
                          <button 
                            onClick={() => desvincularRecurso(recurso.id)}
                            className="p-1 hover:bg-zinc-800 rounded text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {(!detalle.recursosAsignados || detalle.recursosAsignados.length === 0) && (
                        <p className="text-xs text-zinc-500 italic">No hay personal trabajando aquí.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-emerald-400 flex items-center gap-2">
                      <UserPlus className="h-4 w-4" /> Disponibles para Asignar
                    </h4>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto">
                      {recursosLibres.map((recurso) => (
                        <div key={recurso.id} className="flex items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                          <div>
                            <p className="text-xs font-medium text-zinc-200">{recurso.nombre}</p>
                            <p className="text-[10px] text-zinc-400">{recurso.rol}</p>
                          </div>
                          <button 
                            onClick={() => vincularRecurso(recurso.id)}
                            className="text-[11px] px-2 py-1 bg-zinc-800 hover:bg-indigo-600 rounded text-zinc-300 hover:text-white transition-all"
                          >
                            Asignar
                          </button>
                        </div>
                      ))}
                      {recursosLibres.length === 0 && (
                        <p className="text-xs text-zinc-500 italic">Todo el personal está ocupado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}