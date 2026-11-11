# Build do site (vite build + prerender) e entrega via nginx — contexto de build: raiz do repo
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Sem .env: SITE_URL é opcional e, vazio, usa https://shvdigital.com.br/ (src/seo.js)
COPY . .
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
