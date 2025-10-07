# ============================
# Etapa 1: Build del frontend
# ============================
FROM node:22-alpine AS build

# Crear directorio de la app
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Ejecutar build de producción
RUN npm run build


# ============================
# Etapa 2: Servir el build
# ============================
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Opcional: configura tu archivo nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]