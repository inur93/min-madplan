const MongoClient = require('mongodb').MongoClient;



function connect(url) {

    
    const client = new MongoClient(url);
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

module.exports = connect;