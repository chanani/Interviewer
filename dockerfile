# --- 1단계: Build ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# --- 2단계: Production (server.js = 프록시 + 정적 서빙) ---
FROM node:20-alpine

RUN addgroup -g 1001 -S nodegroup && \
    adduser -S -u 1001 -G nodegroup nodeuser

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server.js ./
COPY --from=builder /app/dist ./dist

RUN chown -R nodeuser:nodegroup /app
USER nodeuser

ENV PORT=3009
EXPOSE 3009

CMD ["node", "server.js"]
