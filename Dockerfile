FROM node:20-alpine

# Dependências nativas para better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Instala dependências primeiro (cache de layer)
COPY package*.json ./
RUN npm install --production

# Copia código e frontend
COPY server.js ./
COPY public/ ./public/

# Cria pasta de dados
RUN mkdir -p /data

EXPOSE 3000

CMD ["node", "server.js"]
