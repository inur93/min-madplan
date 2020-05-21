const UrlParse = require('url-parse');
const PageProcessor = require('./PageProcessor');
const DataCleaner = require('./DataCleaner');

class Crawler {

    urls = new Set();
    cleaner;
    resolver;
    constructor(resolver, allowedUnits) {
        this.resolver = resolver;
        this.cleaner = new DataCleaner(allowedUnits);
    }

    crawl = async (url, recursive = false) => {
        const document = await new PageProcessor().run(url);

        //if no title and no ingredients this page is most likely not a recipe
        if (document.title && document.ingredients.length > 0) {
            console.log(`found recipe '${document.title}'`);
            const cleanDocument = this.cleaner.cleanRecipe(document);

            //let caller save the processed recipe
            await this.resolver(cleanDocument);
        }

        //only 
        if (!recursive) return;

        const domain = new UrlParse(url).hostname;
        const urls = document.urls;
        const distinctUrls = new Set(urls.filter(x => new UrlParse(x).hostname === domain));

        let promises = [];
        for (let current of distinctUrls.values()) {
            if (!this.urls.has(current)) {
                this.urls.add(current);
                promises.push(this.crawl(current, recursive));
            }
        }

        await Promise.all(promises);


        // 
    }
}

module.exports = Crawler;
