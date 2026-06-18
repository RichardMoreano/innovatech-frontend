'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, FolderOpen, FolderPlus, Trash2, Info, Users, UserPlus } from 'lucide-react';
import { proyectoService, Proyecto, DetalleProyecto } from '@/services/proyectoService';
import { recursoService, Recurso } from '@/services/recursoService';

export default function GestionProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [recursosLibres, setRecursosLibres] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', estado: 'PLANIFICACION' });
  
  const [selectedProyectoId, setSelectedProyectoId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<DetalleProyecto | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Normalizador de disponibilidad para evitar desajustes boolean/string del Backend
  const esLibre = (r: Recurso) => {
    if (!r) return false;
    const disp = String(r.disponibilidad || '').toUpperCase();
    return disp === 'TRUE' || disp === 'DISPONIBLE' || (r as any).disponible === true;
  };

  useEffect(() => {
    inicializarDatos();
  }, []);

  const inicializarDatos = async () => {
    try {
      setLoading(true);
      const dataProyectos = await proyectoService.obtenerTodos();
      setProyectos(dataProyectos);
      await cargarRecursosDisponibles();
    } catch (err) {
      console.error("Error al inicializar datos:", err);
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
      console.error("Error cargando detalles del proyecto:", err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    try {
      await proyectoService.crear(form);
      const dataProyectos = await proyectoService.obtenerTodos();
      setProyectos(dataProyectos);
      setForm({ nombre: '', descripcion: '', estado: 'PLANIFICACION' });
    } catch (err) {
      alert('Error en el pipeline al registrar el proyecto');
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleEliminar = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('¿Desea dar de baja este proyecto del ecosistema?')) return;
    try {
      await proyectoService.eliminar(id);
      setProyectos(prev => prev.filter(p => p.id !== id));
      if (selectedProyectoId === id) {
        setSelectedProyectoId(null);
        setDetalle(null);
      }
    } catch (err) {
      alert('Error al procesar la eliminación');
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <FolderOpen className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-bold tracking-tight">Ecosistema de Proyectos v2</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900/40 p-5 rounded-lg border border-zinc-800 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Nombre del Proyecto</label>
            <input 
              type="text" required placeholder="Ej. Implementación API Gateway" 
              value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} 
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" 
            />
          </div>
          
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Descripción Funcional</label>
            <input 
              type="text" required placeholder="Defina los alcances del microservicio..." 
              value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} 
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" 
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col gap-1.5 w-48">
            <label className="text-xs font-semibold text-zinc-400 uppercase">Estado Inicial</label>
            <select 
              value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="PLANIFICACION">Planificación</option>
              <option value="EN_DESARROLLO">En Desarrollo</option>
              <option value="PRODUCCION">Producción</option>
            </select>
          </div>

          <button 
            type="submit" disabled={isLoadingForm} 
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all disabled:opacity-50 self-end"
          >
            {isLoadingForm ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FolderPlus className="h-4 w-4" /> Lanzar Proyecto</>}
          </button>
        </div>
      </form>

      {proyectos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
          <Info className="h-5 w-5 text-zinc-600" />
          No se registran proyectos activos devueltos por el sistema.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {proyectos.map((proyecto) => (
            <div 
              key={proyecto.id} 
              onClick={() => proyecto.id && abrirProyecto(proyecto.id)}
              className="group cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950 p-5 hover:border-indigo-500/50 transition-all duration-200 flex justify-between items-start"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-indigo-400" />
                  <h4 className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">{proyecto.nombre}</h4>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 max-w-md">{proyecto.descripcion}</p>
                <span className="inline-flex items-center rounded-md bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-indigo-300 border border-zinc-800">
                  {proyecto.estado}
                </span>
              </div>
              
              <button 
                onClick={(e) => proyecto.id && handleEliminar(e, proyecto.id)}
                className="text-zinc-600 hover:text-red-400 p-2 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

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