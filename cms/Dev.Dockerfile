FROM strapi/strapi

EXPOSE 1337

WORKDIR /cms
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

#not necessary if running with a volume containing all source files
COPY . .

CMD ["strapi", "develop"]