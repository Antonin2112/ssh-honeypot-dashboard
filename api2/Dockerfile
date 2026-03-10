FROM node:20-alpine

WORKDIR /app

COPY src/package*.json .

RUN npm ci

COPY src/ .

RUN adduser -D appuser
USER appuser

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4002/health || exit 1


EXPOSE 4002

CMD ["node", "index.js"]