FROM node:20-alpine

WORKDIR /app

COPY src/package*.json .

RUN npm install --legacy-peer-deps

COPY src/ .

RUN chown -R node:node /app
USER node

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5173 || exit 1

EXPOSE 5173

CMD ["npm", "run", "dev"] 
