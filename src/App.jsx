import React, { useState, useEffect } from 'react';
import { projectService } from './services/api';
import ProjectCard from './components/common/ProjectCard';
import './App.css';

function App() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const response = await projectService.getWithResources();
      setProyectos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el BFF. Verifica que los microservicios estén corriendo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (proyecto) => {
    alert(`Proyecto seleccionado: ${proyecto.nombreProyecto || proyecto.nombre}`);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Innovatech Solutions</h1>
        <p>Plataforma Inteligente de Gestión de Proyectos</p>
      </header>

      <main className="main">
        <div className="dashboard-header">
          <h2>Proyectos en Curso</h2>
          <button onClick={fetchProyectos} className="btn-refresh">↻ Actualizar</button>
        </div>

        {loading && <div className="loading">Cargando proyectos...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="projects-grid">
          {proyectos.length > 0 ? (
            proyectos.map((proyecto, index) => (
              <ProjectCard
                key={index}
                proyecto={proyecto}
                onClick={handleCardClick}
              />
            ))
          ) : (
            !loading && <p>No hay proyectos disponibles</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;