const data_units = require('./data/units.json');
const data_permissions = require('./data/permissions.json');
const { connect, clearCollections } = require('./DbConnector');
const Crawler = require('./Crawler');
const bcrypt = require('bcryptjs');

const handleDbResponse = (err, result) => {
    if (err) console.error('error occurred', err);
}

const crawlRecursive = true;
const crawlUrl = 'https://www.valdemarsro.dk/groentsagswok/';

run();

async function run() {
    const connection = await connect('mongodb://db:27017');
    const db = connection.db('development');

    const setupComplete = await checkSetup(db);
    const password = await hashPassword('chucknorris');
    console.log('test password');
    console.log(password);
    if (!setupComplete) {
        await setSetupComplete(db);
        await Promise.all([
            // populateContent(db),
            initializeUsersAndPermissions(db)
        ]);
    }

    //save data
    connection.close();
}

async function setSetupComplete(db) {
    const setupCollection = db.collection('setup');
    let resolve;
    const promise = new Promise(r => resolve = r);
    setupCollection.insertOne({ complete: true }, function (err, res) {
        resolve();
    })
    return promise;
}
async function checkSetup(db) {
    const setupCollection = db.collection('setup');

    let resolve;
    const promise = new Promise(r => resolve = r);
    setupCollection.find({}).toArray((err, res) => {
        resolve(res.length > 0);
    });
    return promise;
}

async function initializeUsersAndPermissions(db) {

    const roles = await getRoleIds(db);
    
    await Promise.all([
        setupUser(db, roles),
        setupPermissions(db, roles)
    ])

    console.log('enabled all required permissions');
}

async function hashPassword(password) {
    let resolve;
    const promise = new Promise(r => resolve = r);
    bcrypt.hash(`${password}`, 10, (err, hash) => {
        resolve(hash);
    });
    return promise;
}

async function setupUser(db, roles) {
    const userCollection = db.collection('users-permissions_user');
    const username = "chuck@norris.com";
    const password = await hashPassword('chucknorris');

    let resolveFind;
    const promiseFind = new Promise(r => resolveFind = r);
    userCollection.findOne({ username }, function (err, result) {
        resolveFind(result);
    })

    const existing = await promiseFind;
    if (existing) {
        console.log('default user already exists');
        return;
    }

    let resolveInsert;
    const promiseInsert = new Promise(r => resolveInsert = r);
    userCollection.insertOne({
        confirmed: true,
        blocked: false,
        username,
        email: "no-reply@minmadplan.one",
        firstname: "Chuck",
        lastname: "Norris",
        role: roles.authenticatedId,
        provider: 'local',
        password
    }, (err, res) => {
        handleDbResponse(err, res);
        resolveInsert();
    });


    await promiseInsert;

    console.log('default user created');
    return true;
}

async function setupPermissions(db, { authenticatedId, publicId }) {
    console.log(`updating ${data_permissions.length} permissions...`);

    let permissionsCollection = db.collection('users-permissions_permission');
    let promises = [];
    data_permissions.forEach(({ role, controller, action }) => {
        const query = {
            role: role === 'Authenticated' ? authenticatedId : publicId,
            controller,
            action
        };
        const values = {
            $set: {
                enabled: true
            }
        }
        console.log(`enabling ${action} for ${controller} on role ${role}`);
        let resolve;
        let promise = new Promise(r => resolve = r);
        promises.push(promise);
        permissionsCollection.updateOne(query, values, (err, response) => {
            handleDbResponse(err, response);
            resolve();
        });
    })
    await Promise.all(promises);
}

async function getRoleIds(db) {
    let rolesCollection = db.collection('users-permissions_role');

    let resolveRoles;
    const rolesPromise = new Promise(r => resolveRoles = r);
    rolesCollection.find({}).toArray((err, res) => {
        let authRole = res.find(x => x.name === 'Authenticated');
        let publicRole = res.find(x => x.name === 'Public');

        if (!authRole) console.error('Could not find Authenticated role');
        if (!publicRole) console.error('Could not find Public role');
        if (!authRole || !publicRole) {
            console.error('only following roles were found', res);
            return;
        } else {
            resolveRoles({
                authenticatedId: authRole._id,
                publicId: publicRole._id,
            })
        }
    });
    return rolesPromise;
}

async function populateContent(db) {
    let recipeCollection = db.collection('recipes');
    let unitsCollection = db.collection('units');
    let recipeItemCollection = db.collection('components_product_recipe_items');
    let productItemCollection = db.collection('product_items');

    clearCollections([
        recipeCollection,
        unitsCollection,
        recipeItemCollection,
        productItemCollection,
        db.collection('food_plans'),
        db.collection('components_links_recipe_links'),
        db.collection('components_product_shopping_items'),
        db.collection('shopping_lists')]);

    let products = new Set();

    unitsCollection.insertMany(data_units, handleDbResponse);

    //crawl website and clean data
    const resolver = (recipe) => {
        //make async
        let resolve;
        const promise = new Promise(r => resolve = r);
        //create products
        let recipeProducts = recipe.ingredients.map(({ name }) => name);

        //make sure the same product does not occur twice in the list
        let uniqueProducts = Array.from(new Set(recipeProducts));
        //make sure the product has not already been added
        uniqueProducts = uniqueProducts.filter(x => !products.has(x));
        //remember which products have been saved
        uniqueProducts.forEach(x => products.add(x));

        //insert the products to database
        if (uniqueProducts.length > 0) {
            productItemCollection.insertMany(uniqueProducts.map(name => ({ name })), handleDbResponse);
        } else {
            console.warn(`recipe '${recipe.title}' has no product items`);
        }

        if (recipe.ingredients.length == 0) {
            console.warn(`recipe '${recipe.title}' has no ingredients`);
        }
        //create ingredients and then recipe
        recipeItemCollection.insertMany(recipe.ingredients, (err, result) => {
            const items = result.insertedIds;

            recipe.ingredients = Object.keys(items).map((key) => {
                const id = items[key];
                return {
                    _id: id,
                    ref: id,
                    kind: 'ComponentProductRecipeItem'
                }
            })
            recipeCollection.insertOne(recipe, (err, res) => {
                handleDbResponse(err, res);
                resolve();
            });
        });
        return promise;
    }
    const crawler = new Crawler(resolver, data_units.map(x => x.name));
    await crawler.crawl(crawlUrl, crawlRecursive);
}


