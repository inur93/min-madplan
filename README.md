![CI master](https://github.com/inur93/min-madplan/workflows/CI/badge.svg)

# Introduction #
This is a hobby project creating a food plan for the week combined with a shopping list that can be automatically generated from the plan.
The app is available here [minmadplan.one](http://minmadplan.one/) and requires a user to enter the site.

# Development #
The development environment is setup using docker which means all that is required is that docker is installed. After cloning the project do the following.
1. From the root direcotry run `docker-compose up --build` . This will create  docker images and run the containers. There is one container for the database running MongoDB, one for the CMS system (Strapi) and one for the frontend web app using NextJS. There is also one container running automatic tests.
2. When running the Strapi for the first time some setup is required. Login to Strapi admin panel [localhost:1337/admin](http://localhost:1337/admin):  
  2.1 Create an admin user as requested
  2.2 After successful login go to `Plugins > Roles & Permissions` in the left navigation menu.  
  2.3 First select the Public role and tick off the following  
    Page-Settings: find, findone  
    Users-permissions > Auth: changepassword, forgotpassword, me  
  2.4 Remember to save the changes before opening the Authenticated role and tick off the following permissions  
    Page-Settings: find  
    Shopping-List: find, update, create, findone, delete, refresh  
    Unit: find
    Recipe: count, find, findone  
    Product-Item: find
    Group-Invite: accept, decline, count, find  
    Food-Plan: count, delete, update, create, find, createshoppinglist, findone  
    Group: find, leave, create, findone, update, delete  
  2.5 Save the changes.  
  2.6 Next we need to create a user so we are able to login to the app. Go to `Users` and add a new user with all the required fields. remember to toggle the 'Confirmed' switch otherwise it will not be possible to login.
  2.7 The following steps are optional but make the experience better for development. (TODO configurations, add images, populate database)

# Deployment #
The application is deployed automatically when code is pushed to the master branch.
The frontend app is hosted on [vercel.com](https://vercel.com/) the production app can be accessed here [minmadplan.one](http://minmadplan.one/) and test can be accessed here [min-madplan-app-git-develop.runivormadal.now.sh](https://min-madplan-app-git-develop.runivormadal.now.sh/) which is up-to-date with the develop branch.

to be continued...