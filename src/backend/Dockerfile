FROM node:18

WORKDIR /app

# Copiamos los archivos de npm
COPY src/backend/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY src/backend .

# Exponemos el puerto del backend
EXPOSE 5000

# Comando de inicio
CMD ["node", "server.js"]
