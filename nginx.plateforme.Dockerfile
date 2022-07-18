# ATTENTION ! Ce Docker File build l'application React (ce qui peut prendre du temps)
# Puis démarre NGINX, pour modifier la confirmation Nginx il faut modifier le fichier nginx.conf

FROM node:16 as build
ARG REACT_APP=/plateforme
WORKDIR /app

COPY ./plateforme/package*.json ./

RUN npm install

COPY ./plateforme .

RUN npm run build

FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html