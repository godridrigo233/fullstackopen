FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm test

ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80