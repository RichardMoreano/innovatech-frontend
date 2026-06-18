import RecursosComponent from '@/components/recursos/GestionRecursos'; // Ajusta según el nombre de tu export

export default function RecursosPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Recursos</h1>
        <p className="text-zinc-400 mt-1">Administración de personal y asignaciones del sistema.</p>
      </header>
      <RecursosComponent />
    </div>
  );
}