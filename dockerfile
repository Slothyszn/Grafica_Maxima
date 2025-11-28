# Usa Node oficial
FROM node:18

# Cria diretório da aplicação
WORKDIR /app

# Copia apenas o backend
COPY back/package.json back/package-lock.json /app/

# Instala dependências
RUN npm install

# Copia todo o backend
COPY back /app

# Define porta para o Railway
ENV PORT=3000

# Abre a porta
EXPOSE 3000

# Inicia o servidor
CMD ["node", "api.js"]
