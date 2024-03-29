FROM node:16.14.2-alpine as build
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm rum build

FROM nginx:stable-alpine as server

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./app/build /usr/share/nginx/html

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'