FROM node:lts-alpine3.15
WORKDIR /api_cegid
ENV DIRPATH=./config.prod.env
COPY *.env ./
COPY package*.json ./

RUN npm install --prefer-offline --no-audit
RUN npm ci  --prefer-offline --no-audit
COPY . .
EXPOSE 5000
