# Dockerfile.dev - React (desenvolvimento)
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "start"]
