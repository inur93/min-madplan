
const Migrater = require('./MigrateData');
const MongoClient = require('mongodb').MongoClient;
const UrlParse = require('url-parse');
const url = 'mongodb://localhost:27017';
const dbName = 'min-madplan-crawler';
const targetDbName = 'development';
const Connector = require('./DbConnector');
const MigrateDb = require('./DbMigration');

async function run() {
    const production = await Connector('//production_connectionstring');
    const local = await Connector('mongodb://localhost:27017');

    const target = production.db('madplan_strapi');
    const source = local.db('development');


    await MigrateDb(source, target);


    production.close();
    local.close();
}

run();

// client.connect(async function (err) {

//     const { src, target } = getDbs();
//     //const crawler = new Crawler(db);
//     //await crawler.crawl('https://www.valdemarsro.dk');

//     try {
//         // await clearData(src, target);
//         // await new DataCleaner(src).preprocessRawData();
//         // await new Migrater(src, target).migrateRecipeItems();
//         await new Migrater(src, target).migrateRecipes();
//     } catch (err) {
//         console.log('completed with errors', err);
//     }
//     client.close();
//     console.log('Complete!');
// });


