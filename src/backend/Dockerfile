FROM node:18

WORKDIR /app

COPY src/backend/package*.json ./

RUN npm install

COPY src/backend .

EXPOSE 5000

CMD ["node", "server.js"]
