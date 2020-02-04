FROM strapi/base

WORKDIR /cms

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ENV NODE_ENV production

RUN yarn build

#Heroku does not support Expose the app should instead use the PORT env variable
#EXPOSE 1337

CMD ["yarn", "start"]