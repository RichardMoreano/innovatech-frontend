import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ proyecto, onClick }) => {
  return (
    <div className="project-card" onClick={() => onClick?.(proyecto)}>
      <h3>{proyecto.nombreProyecto || proyecto.nombre}</h3>
      <p className={`status ${proyecto.estado?.toLowerCase()}`}>
        {proyecto.estado}
      </p>
      <p><strong>Inicio:</strong> {new Date(proyecto.fechaInicio).toLocaleDateString()}</p>

      {proyecto.recursosAsignados && (
        <div className="resources">
          <strong>Recursos:</strong> {proyecto.recursosAsignados.length}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;