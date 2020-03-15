const PageProcessor = require('./PageProcessor');
const DataCleaner = require('./DataCleaner');
const Migrater = require('./MigrateData');
const MongoClient = require('mongodb').MongoClient;
const UrlParse = require('url-parse');
const url = 'mongodb://localhost:27017';
const dbName = 'min-madplan-crawler';
const targetDbName = 'development';

const client = new MongoClient(url);

client.connect(async function (err) {

    const db = client.db(dbName);
    const targetDb = client.db(targetDbName);
    //const crawler = new Crawler(db);
    //await crawler.crawl('https://www.valdemarsro.dk');
    await new DataCleaner(db).clean();
    // await new Migrater(db, targetDb).migrateRecipeItems();
    client.close();
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
            this.collection.insertMany([{title, ingredients, instructions, url, stats}], function(err, result){
            
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