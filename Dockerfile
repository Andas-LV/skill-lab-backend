FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

RUN npm install -g tsc-alias
RUN npm install typescript -D
RUN npx tsc && tsc-alias -p tsconfig.json

EXPOSE 8000

CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]