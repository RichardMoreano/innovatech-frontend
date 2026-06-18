import GestionProyectos from '@/components/proyectos/GestionProyectos';

export default function ProyectosPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Proyectos</h1>
        <p className="text-zinc-400 mt-1">
          Control de ciclo de vida de los servicios del core de negocio.
        </p>
      </header>
      <GestionProyectos />
    </div>
  );
}