const UrlParse = require('url-parse');
const PageProcessor = require('./PageProcessor');
const DataCleaner = require('./DataCleaner');
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

module.exports = Crawler;
