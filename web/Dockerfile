FROM node:current-alpine

WORKDIR /app/web

COPY ../web/src/package.json .
RUN npm install

COPY ../web/src/ .