FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Финальный образ — nginx для раздачи статики
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx конфиг для SPA (все роуты отдаём в index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80