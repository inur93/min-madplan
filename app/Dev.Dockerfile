FROM alpine:latest

EXPOSE 8000

RUN apk add --update nodejs-current npm
RUN npm install --global gatsby-cli

WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

#not necessary if running with a volume
COPY . .

CMD ["gatsby", "develop"]