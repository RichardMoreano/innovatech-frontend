# Guía de Ejecución con Docker - Frontend (React SPA) V2

Este componente aloja la interfaz de usuario basada en React y Vite, optimizada para consumir servicios a través de la capa perimetral (API Gateway).

## 1. Prerrequisitos y Puertos
* **Entorno de Red:** Requiere resolución de red hacia el API Gateway (`http://localhost:8083`).
* **Puerto Interno (Contenedor Nginx/Vite):** `3000` o `80` (según configuración del Dockerfile).
* **Puerto Externo (Host):** Mapeado para acceso directo desde el navegador del desarrollador.

---

## 2. Comandos de Operación

### Despliegue en Desarrollo/Producción
```bash
docker compose up -d --build innovatech-frontend