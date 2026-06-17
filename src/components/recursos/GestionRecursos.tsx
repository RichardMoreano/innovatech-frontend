'use client';

import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Mail, Shield, Briefcase, Trash2, Loader2 } from 'lucide-react';
import { recursoService, Recurso } from '@/services/recursoService';

export default function GestionRecursos() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', rol: '', disponibilidad: true, horasSemana: 40 });

  const cargarRecursos = async () => {
    try {
      const data = await recursoService.obtainAll();
      setRecursos(data);
    } catch (err) {
      console.error('Error al cargar recursos', err);
    }
  };

  useEffect(() => { cargarRecursos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await recursoService.crear(form);
      await cargarRecursos();
      setForm({ nombre: '', apellido: '', email: '', rol: '', disponibilidad: true, horasSemana: 40 });
    } catch (err) {
      alert('Error al crear el recurso');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Confirmas la baja de este recurso?')) return;
    try {
      await recursoService.eliminar(id);
      await cargarRecursos();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Users className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-bold tracking-tight">Gestión de Capital Humano V2</h2>
      </div>

      {/* Formulario de Alta */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-zinc-900/40 p-4 rounded-lg border border-zinc-800">
        <input type="text" required placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" />
        <input type="text" required placeholder="Apellido" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" />
        <input type="email" required placeholder="Email corporativo" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" />
        <input type="text" required placeholder="Rol (ej. Senior Developer)" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" />
        <input type="number" required min="1" max="45" placeholder="Horas semanales" value={form.horasSemana} onChange={e => setForm({...form, horasSemana: parseInt(e.target.value) || 0})} className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none" />
        
        <button type="submit" disabled={isLoading} className="flex justify-center items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 transition-all disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserPlus className="h-4 w-4" /> Registrar</>}
        </button>
      </form>

      {/* Tabla de Datos */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm text-zinc-300">
          <thead className="bg-zinc-900/80 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-800">
            <tr>
              <th className="p-4">Colaborador</th>
              <th className="p-4">Rol / Especialidad</th>
              <th className="p-4">Carga Horaria</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {recursos.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="p-4 font-medium text-zinc-100">{r.nombre} {r.apellido}<br/><span className="text-xs text-zinc-500">{r.email}</span></td>
                <td className="p-4">{r.rol}</td>
                <td className="p-4">{r.horasSemana} hrs/semana</td>
                <td className="p-4 text-center">
                  <button onClick={() => r.id && handleEliminar(r.id)} className="text-zinc-500 hover:text-red-400 p-1 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}