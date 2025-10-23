# Versión de Node.js a instalar en la imagen
FROM node:16-alpine

# Crear directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar todo el código fuente
COPY . .

# Crear directorio para uploads si no existe
RUN mkdir -p uploads

# Exponer el puerto de la aplicación
EXPOSE 4001

# Variables de entorno por defecto (se sobrescriben con docker-compose)
ENV PORT=4001

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]