FROM alpine:latest

RUN apk add --update nodejs-current npm
RUN npm install --global gatsby-cli

WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY . .

RUN gatsby build


#Heroku does not support Expose the app should instead use the PORT env variable
#EXPOSE 1337

CMD ["gatsby", "serve -p $PORT"]