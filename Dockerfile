FROM node:16.5-alpine AS build

RUN apk add --update rsync

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build:client
RUN npm run build:server

FROM node:16.5-alpine
WORKDIR /usr/src/app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env .

EXPOSE 5342

CMD [ "node", "./dist/server.js" ]