# Innovatech Frontend

Frontend de la Plataforma Inteligente para la Gestión de Proyectos - Innovatech Solutions

## Tecnologías utilizadas
- **React 18** + **Vite**
- **Axios** para consumo de APIs
- **Componentes reutilizables** (preparado como NPM Module)
- Diseño moderno y responsive

## Estructura principal

src/
├── components/
│   └── common/
│       └── ProjectCard.jsx          ← Componente reutilizable (NPM)
├── services/
│   └── api.js                       ← Conexión con BFF
├── App.jsx
└── main.jsx


## Endpoints que consume

| Endpoint                        | Descripción |
|-------------------------------|-----------|
| `/api/bff/proyectos-con-recursos` | Proyectos con recursos asignados (orquestación) |
| `/api/bff/proyectos`           | Listado de proyectos |
| `/api/bff/recursos`            | Listado de recursos |

## Cómo ejecutar localmente

```bash
npm install
npm run dev

El frontend se conecta al BFF en el puerto 8080.