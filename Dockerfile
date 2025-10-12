FROM node:22

WORKDIR /app

COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Instalar Vite globalmente
RUN npm install -g vite

COPY . .

EXPOSE 5173

# Forzar Vite a escuchar en todas las interfaces
CMD ["vite", "--host", "0.0.0.0", "--port", "5173"]
