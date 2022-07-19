FROM node:16.5-alpine

RUN apk add --update rsync

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build:client
RUN npm run build:server

EXPOSE 5342

CMD [ "node", "./dist/server.js" ]