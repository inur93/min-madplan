FROM strapi/base

WORKDIR /cms
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

#copy the rest of the code into image
COPY . .

#set production mode
ENV NODE_ENV production

#builds the admin interface
RUN yarn run build

#Heroku does not support Expose the app should instead use the PORT env variable
#EXPOSE 1337

CMD ["yarn", "start"]