# Dockerfile para o Frontend (aplicação React)

# Estágio de Build: Construir a aplicação React
FROM node:18-alpine as build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --force

# Copia todo o restante do código da aplicação
COPY . .

# Constrói a aplicação React para produção
# Isso irá gerar os arquivos estáticos na pasta 'build'
RUN npm run build

# Estágio de Servir: Usar Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copia a configuração padrão do Nginx para o container
# Este arquivo vai direcionar o Nginx para servir os arquivos estáticos do React
COPY --from=build /app/build /usr/share/nginx/html

# O Nginx escuta na porta 80 por padrão, não precisa de EXPOSE aqui.
# O Nginx inicia automaticamente, não precisa de CMD aqui.