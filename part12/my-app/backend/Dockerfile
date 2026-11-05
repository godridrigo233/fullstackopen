FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .

ENV NODE_ENV=production
USER node

EXPOSE 3003
CMD ["npm", "start"]