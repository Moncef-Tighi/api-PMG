FROM node:16
WORKDIR /api_cegid
ENV DIRPATH=./config.prod.env
COPY *.env ./
COPY package*.json ./

RUN npm install
RUN npm ci
COPY . .
EXPOSE 4001
CMD ["npm", "run", "start"]
