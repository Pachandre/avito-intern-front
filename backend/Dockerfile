FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --prod

COPY src ./src
COPY server.js ./
COPY schema.yaml ./

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "server.js"]
