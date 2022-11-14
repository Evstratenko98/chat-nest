FROM node:16-alpine as builder
#RUN apk add --no-cache libc6-compat
WORKDIR /nest
COPY package.json ./
RUN npm install
#COPY ./ ./
#CMD npm run start
EXPOSE 3000