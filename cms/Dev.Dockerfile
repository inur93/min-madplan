FROM strapi/strapi:3.0.0-beta.18.7-node12

WORKDIR /cms
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

#not necessary if running with a volume containing all source files
COPY . .

EXPOSE 1337
EXPOSE 9230
EXPOSE 9231

CMD ["strapi", "develop"]