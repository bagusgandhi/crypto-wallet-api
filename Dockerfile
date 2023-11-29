FROM node:18-alpine

WORKDIR /app

RUN apk update

COPY package-lock.json package.json /app/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build && \
    npm prune --production --silent

EXPOSE 3000

CMD ["node", "dist/main"]