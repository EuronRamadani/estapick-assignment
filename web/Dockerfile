FROM node:22-bookworm-slim

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci

COPY next.config.ts tsconfig.json eslint.config.mjs next-env.d.ts ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]
