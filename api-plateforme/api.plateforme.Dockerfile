FROM node:lts-alpine3.15
WORKDIR /api_plateforme
ENV DIRPATH=./config.docker.env
COPY *.env ./
COPY package*.json ./

# RUN npm install
RUN npm ci  --prefer-offline --no-audit
COPY . .

EXPOSE 4001
CMD ["npm", "run", "start"]
