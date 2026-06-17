'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, AlertTriangle, Zap, Activity } from 'lucide-react';
import { monitoreoService, DashboardAnalitico } from '@/services/monitoreoService';

export default function DashboardMonitoreo() {
  const [data, setData] = useState<DashboardAnalitico | null>(null);

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        const res = await monitoreoService.obtenerDashboard();
        setData(res);
      } catch (err) {
        console.error("Error cargando analíticas", err);
      }
    };
    cargarMetricas();
    const interval = setInterval(cargarMetricas, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-zinc-400 text-sm">Cargando telemetría...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Card Total */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Eventos</span>
            <Activity className="h-5 w-5 text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{data.totalEventos}</p>
        </div>

        {/* Card Errores */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Errores</span>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-red-400">{data.totalErrores}</p>
        </div>

        {/* Card Latencia */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Latencia Promedio</span>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{data.promedioLatenciaMs.toFixed(2)} ms</p>
        </div>
      </div>

      {/* Tabla de Eventos Recientes */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Últimas Métricas del Ecosistema</h3>
        <div className="space-y-2">
          {data.ultimosEventos.map((e) => (
            <div key={e.id} className="flex justify-between items-center py-2 px-3 rounded bg-zinc-900/50 text-xs text-zinc-300 border border-zinc-800/40">
              <span><strong className={e.tipoEvento === 'ERROR' ? 'text-red-400' : 'text-indigo-400'}>[{e.tipoEvento}]</strong> {e.componente} - {e.descripcion}</span>
              <span className="text-zinc-500">{e.duracionMs}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}