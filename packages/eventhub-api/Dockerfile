FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Instalar dependencias
RUN yarn install
RUN yarn add -D @nestjs/cli

COPY . .

EXPOSE 3000

# Usar npm en lugar de nest directamente
CMD ["npm", "run", "start:dev"] 