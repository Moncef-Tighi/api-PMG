FROM node:lts-alpine3.15
WORKDIR /api_cegid
ENV DIRPATH=./config.prod.env
COPY *.env ./
COPY package*.json ./

RUN npm install -g npm@latest
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install --prefer-offline --no-audit
RUN npm ci  --prefer-offline --no-audit
COPY . .
EXPOSE 5000
