FROM node:22

WORKDIR /app

# Copiamos los archivos del frontend
COPY package*.json ./

RUN npm install

# Copiamos el resto del código del frontend
COPY . .

# Exponemos el puerto de Vite/React
EXPOSE 5173

# Ejecutamos el frontend
CMD ["npm", "run", "dev"]
