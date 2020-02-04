FROM alpine:latest

EXPOSE 8000
#necessary to create the initial example app
RUN apk add --update nodejs-current npm git
# npm complains about this not being installed
RUN npm install --global npm-git-install core-js@^3

RUN npm install --global gatsby-cli
#seemed to be necessary but apparantly can be avoided
#RUN npm install --global detect-libc python
RUN mkdir app
CMD gatsby
# build this image
#docker build -t vormadal/gatsby-cli .\gatsby-cli\
#create the example app - note that the destination folder, in this case the 'app' folder should be empty
#docker run -ti --rm -v ${PWD}/app:/app vormadal/gatsby-cli gatsby new app https://github.com/gatsbyjs/gatsby-starter-default
#run the app in development mode - view at localhost:8000 and the graphql editor on localhost:8000/___graphql
#docker run -ti --rm -p 8000:8000 -v ${PWD}/app:/app vormadal/gatsby-cli sh -c "cd app && gatsby develop --host=0.0.0.0"

#stop and remove all containers
#docker stop $(docker ps -a -q)
#docker rm $(docker ps -a -q)


#If using bash you may experience an error where ';C' is added at the end of the path.
#	see https://stackoverflow.com/questions/50608301/docker-mounted-volume-adds-c-to-end-of-windows-path-when-translating-from-linux
#	
#	If experience errors when running gatsby develop try to:
#		1. remove package-lock.json
#		2. gatsby clean
#		3. remove node_modules
#		4. install dependencies again
#		5. Run gatsby-develop
#	the issue seems to be related in some dependencies being installed in wrong order.
#	https://github.com/gatsbyjs/gatsby/issues/17557


#Strapi
#	https://github.com/strapi/strapi-docker
#	docker run -it -p 1337:1337 -v ${pwd}/cms:/srv/app strapi/strapi
#	for setup goto localhost:1337/admin
#	
#	//authentication
#	https://strapi.io/documentation/3.0.0-alpha.x/guides/authentication.html#registration


# setup strapi with gatsby
# npm install --save gatsby-source-strapi

# insert plugin in gatsby-config.js
#{
#      resolve: 'gatsby-source-strapi',
#      options: {
#        apiURL: 'http://localhost:1337',
#        contentTypes: [ // List of the Content Types you want to be able to request from Gatsby.
#          'article',
#          'user'
#        ],
#        queryLimit: 1000,
#      },
#    },