# Innovatech Frontend

Este repositorio contiene la interfaz web de la plataforma Innovatech, diseñada para interactuar con los microservicios y BFF del ecosistema mediante una arquitectura desacoplada y orientada a componentes.

## Resumen

`innovatech-frontend` provee herramientas operacionales para la gestión de proyectos, asignación de capital humano y visualización de telemetría en tiempo real. Está construido sobre **React**, estructurado con **Vite** para optimizar el flujo de desarrollo y estilizado mediante **Tailwind CSS**.

### Funcionalidades Clave

- **Control de Acceso:** Autenticación de usuarios y persistencia segura de tokens JWT en `localStorage`.
- **Gestión de Proyectos:** Flujo completo del ciclo de vida (Planificación, En Progreso y Finalizado), asignación y desasignación dinámica de recursos, además de borrado lógico.
- **Gestión de Recursos:** Administración de personal, roles, carga horaria y disponibilidad.
- **Dashboard de Monitoreo:** Consumo y visualización de métricas del sistema mediante sondeo periódico.

---

## Estructura del Repositorio

### Archivos principales

- `package.json` - Definición de scripts del ciclo de vida y dependencias del proyecto.

### Directorio `src/`

#### Cliente HTTP

- `lib/axios.ts` - Cliente HTTP centralizado con interceptor para inyección automática del token JWT.

#### Servicios

- `services/proyectoService.ts`
- `services/recursoService.ts`
- `services/monitoreoService.ts`

#### Componentes

##### Autenticación

- `components/auth/LoginForm.tsx` - Formularios de acceso y gestión de sesión.

##### Proyectos

- `components/proyectos/GestionProyectos.tsx` - Administración y visualización de proyectos.

##### Recursos

- `components/recursos/GestionRecursos.tsx` - Gestión de recursos humanos.

##### Monitoreo

- `components/monitoreo/DashboardMonitoreo.tsx` - Visualización de métricas operacionales.

##### Componentes Comunes

- `components/common/` - Componentes reutilizables como modales, spinners y layouts.

---

## Dependencias Principales

### Core UI

- React
- Tailwind CSS
- Lucide React

### Cliente de Red

- Axios

### Testing

- Vitest
- @testing-library/react
- @vitest/coverage-v8

---

# Ejecución Local

## Requisitos Mínimos

- Node.js 18 o superior
- npm o yarn

## Instalación y Arranque

### Instalar dependencias

```bash
npm install
```

### Levantar entorno de desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:5173
```

---

# Scripts del Ciclo de Vida

## Desarrollo

```bash
npm run dev
```

Ejecuta el servidor de desarrollo local con Hot Module Replacement (HMR).

## Compilación

```bash
npm run build
```

Genera el artefacto optimizado de producción en el directorio `dist/`.

## Vista previa de producción

```bash
npm run preview
```

Sirve localmente la versión compilada para validaciones previas al despliegue.

## Pruebas

```bash
npm run test
```

Ejecuta la suite completa de pruebas unitarias e integración.

---

# Arquitectura de Pruebas y Cobertura

La estrategia de testing automatizado se basa en el aislamiento de componentes mediante el uso de mocks sobre la capa de servicios, garantizando la predictibilidad de la interfaz sin depender de servicios externos.

## Ejecución de Pruebas

### Ejecutar pruebas

```bash
npm run test
```

### Generar reporte de cobertura

```bash
npx vitest run --coverage
```

---

# Directrices Técnicas Aplicadas

## Mocks Estrictos

Uso de `vi.mock()` para interceptar llamadas a la capa de servicios (`@/services/*`), evitando dependencias de red durante las pruebas.

## Branch Coverage

Cobertura de escenarios alternativos incluyendo:

- Errores de red (`catch`)
- Cancelaciones de diálogos (`confirm`)
- Manejo de excepciones críticas
- Validaciones de formularios

## Manejo de Timers

Uso controlado de:

- `waitFor`
- Utilidades asíncronas de Testing Library

Esto evita dependencias de timers globales y facilita la prueba de componentes que utilizan `setInterval`.

---

# Componentes Principales

## LoginForm

**Ubicación:** `src/components/auth/LoginForm.tsx`

Responsabilidades:

- Procesar credenciales de autenticación.
- Consumir el servicio de identidad.
- Gestionar estados de error en la interfaz.
- Persistir el JWT en `localStorage` tras una autenticación exitosa.

## GestionProyectos

**Ubicación:** `src/components/proyectos/GestionProyectos.tsx`

Responsabilidades:

- Administrar el renderizado de proyectos.
- Gestionar modales de asignación.
- Ejecutar cambios de estado de proyectos.
- Actualizar recursos disponibles en paralelo.

## GestionRecursos

**Ubicación:** `src/components/recursos/GestionRecursos.tsx`

Responsabilidades:

- Administrar el formulario de recursos.
- Visualizar personal técnico.
- Normalizar datos provenientes del backend.
- Gestionar disponibilidad y carga horaria.

## DashboardMonitoreo

**Ubicación:** `src/components/monitoreo/DashboardMonitoreo.tsx`

Responsabilidades:

- Consumir telemetría del sistema.
- Actualizar métricas periódicamente.
- Gestionar procesos asíncronos mediante hooks de React.
- Renderizar indicadores operacionales en tiempo real.

---

# Despliegue

El proyecto genera un artefacto completamente estático (Single Page Application - SPA).

## Generar artefacto de producción

```bash
npm run build
```

El contenido generado en el directorio `dist/` puede desplegarse mediante:

- Nginx
- CDN (Content Delivery Network)
- Servidores web estáticos
- Infraestructura integrada dentro del BFF
- Servicios de hosting para aplicaciones SPA