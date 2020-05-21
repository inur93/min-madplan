const MongoClient = require('mongodb').MongoClient;

async function clearCollections(collections) {
    const clear = function (_collections) {
        console.log(`clearing ${_collections.length} collections...`);
        let promises = [];
        _collections.forEach(collection => {
            console.log(`clearing ${collection.collectionName}...`);
            let resolver;
            const promise = new Promise(resolve => resolver = resolve);
            collection.deleteMany({}, function () {
                console.log(`${collection.collectionName} cleared.`);
                resolver();
            });
            promises.push(promise);
        });
        return promises;
    }

    await Promise.all(clear(collections));

    console.log('all collections cleared');
    return true;
}

function connect(url) {
    const client = new MongoClient(url, {
        useUnifiedTopology: true
    });
    let resolve;
    client.connect(async function (err) {
        if (err) {
            console.log('could not connect to mongo: ', err);
        } else {
            resolve(client);
        }
    })
    return new Promise(resolver => resolve = resolver);
}

module.exports = {
    connect,
    clearCollections
}