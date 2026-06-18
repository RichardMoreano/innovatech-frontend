import MonitoreoComponent from '@/components/monitoreo/DashboardMonitoreo';

export default function AnaliticaPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Monitoreo y Analítica</h1>
        <p className="text-zinc-400 mt-1">Métricas de rendimiento en tiempo real de los microservicios.</p>
      </header>
      <MonitoreoComponent />
    </div>
  );
}