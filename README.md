# Get started #
1. Run `docker-compose up --build` . This will create docker images and run the containers where the Gatsby has access to the Strapi api.
2. Log into Strapi admin panel [localhost:1337/admin](http://localhost:1337/admin):  
  2.1 The first time you will have to create an admin user  
3. Go to 'Roles & Permissions' under 'Plugins' on the left panel.  
4. Select the public role, and under 'Permissions' > 'Application' check 'find' under 'Recipe-Item' and 'Shoppinglist'
5. Scroll further down and expand the 'Users-permissions' and check 'find' under 'User' as well.
6. This will give the Gatsby app access to these content types and will enable it to query data via Graphql.
7. Create some dummy data in each of the 3 content types.
8. Stop the containers with `Ctrl+C` and run `docker-compose up` again.
9. Now you should see the front page at [localhost:8000](http://localhost:8000) listing the dummy data from Recipe Item content type and at [localhost:8000/___graphql](http://localhost:8000/___graphql) you can build your graphql queries. 

# Deploy to Heroku #
(this only includes the Strapi application.)
Before going further make sure:
* that heroku client is installed fx by running `heroku -v`

to be continued...

test igen
