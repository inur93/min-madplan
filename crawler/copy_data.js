const PageProcessor = require('./PageProcessor');
const DataCleaner = require('./DataCleaner');
const Migrater = require('./MigrateData');
const MongoClient = require('mongodb').MongoClient;
const UrlParse = require('url-parse');
const url = 'mongodb://localhost:27017';
const dbName = 'min-madplan-crawler';
const targetDbName = 'development';



async function clearData(srcDb, targetDb) {
    const clear = function (list) {
        console.log('clearing data...');
        let promises = [];
        list.forEach(element => {
            let resolver;
            const promise = new Promise(resolve => resolver = resolve);
            element.deleteMany({}, function () {
                resolver();
            });
            promises.push(promise);
        });
        return promises;
    }
    return await Promise.all(clear([srcDb.collection('recipes_clean'),
    srcDb.collection('product_clean'),
    targetDb.collection('components_product_recipe_items'),
    targetDb.collection('components_links_recipe_links'),
    targetDb.collection('components_product_shopping_items'),
    targetDb.collection('product_items'),
    targetDb.collection('recipes'),
    targetDb.collection('shopping_lists')]));
}

function getDbs() {
    return {
        src: client.db(dbName),
        target: client.db(targetDbName)
    }
}
const client = new MongoClient(url);
client.connect(async function (err) {

    const { src, target } = getDbs();
    //const crawler = new Crawler(db);
    //await crawler.crawl('https://www.valdemarsro.dk');

    try {
        // await clearData(src, target);
        // await new DataCleaner(src).preprocessRawData();
        // await new Migrater(src, target).migrateRecipeItems();
        await new Migrater(src, target).migrateRecipes();
    } catch (err) {
        console.log('completed with errors', err);
    }
    client.close();
    console.log('Complete!');
});




class Crawler {

    urls = new Set();
    collection;
    constructor(db) {
        this.collection = db.collection('raw_recipes');
    }

    crawl = async (url) => {
        const { ingredients, instructions, urls, title, stats } = await new PageProcessor().run(url);
        const domain = new UrlParse(url).hostname;
        const distinctUrls = new Set(urls.filter(x => new UrlParse(x).hostname === domain));
        if (ingredients.length > 0 && title && instructions) {
            this.collection.insertMany([{ title, ingredients, instructions, url, stats }], function (err, result) {

            });
        }
        let promises = [];
        for (let current of distinctUrls.values()) {
            if (!this.urls.has(current)) {
                this.urls.add(current);
                promises.push(this.crawl(current));
            }
        }

        await Promise.all(promises);


        // 
    }


}