FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

RUN mkdir -p /data

EXPOSE 3001

ENV PORT=3001
ENV CHECK_INTERVAL_SEC=60
ENV DATA_DIR=/data
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
