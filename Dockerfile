FROM node:16.5-alpine

RUN apk add --update rsync

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5500

CMD [ "npm", "start" ]