FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Set the command to run when the container starts
CMD ["node", "server.js"]