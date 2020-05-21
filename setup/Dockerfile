FROM strapi/strapi:3.0.0-beta.18.7-node12
#FROM node:12.13.0-alpine
#FROM node:10.11-alpine

WORKDIR /setup
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

#not necessary if running with a volume
COPY . .

CMD ["node", "app.js"]