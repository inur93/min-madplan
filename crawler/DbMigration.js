

async function migrateStrapiData(src, target) {
    const collections = [
        //'components_product_recipe_items',
        'product_items',
        'recipes',
        'units'];

    let rs = [];
    for (let index = 0; index < collections.length; index++) {
        const collection = collections[index];
        let r;
        src.collection(collection).find({}).toArray(function (err, docs) {
            target.collection(collection).insertMany(docs, function(){
                r();
            });
        })
        let promise = new Promise(res => r = res);
        rs.push(promise);
    }
    return await Promise.all(rs);
}


module.exports = migrateStrapiData;