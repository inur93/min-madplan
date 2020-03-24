FROM node:10.11-alpine
#FROM node:12.13.0-alpine

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

#not necessary if running with a volume
COPY . .

EXPOSE 3000
EXPOSE 9229
#debug port

CMD ["yarn", "run", "dev"]