# --- ETAPA 1: Instalación de Dependencias y Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias de forma limpia
RUN npm ci

# Copiar el resto del código fuente del frontend
COPY . .

# Argumento e Variable de Entorno requerida por Next.js en tiempo de compilación
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Compilar la aplicación Next.js
RUN npm run build

# --- ETAPA 2: Imagen de Ejecución Ligera ---
FROM node:20-alpine AS runner
WORKDIR /app

# Configurar entorno de producción
ENV NODE_ENV=production

# Crear usuario seguro no-root para ejecutar la app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copiar recursos estáticos y artefactos compilados desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Asignar permisos al usuario seguro
USER nextjs

# Puerto estándar de Next.js (documentación)
EXPOSE 3000

# Comando de arranque
CMD ["npm", "run", "start"]