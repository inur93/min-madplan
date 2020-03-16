
class MigrateData {

    recipeItemsTarget;
    recipeItemsSource;
    resolver;
    constructor(sourcedb, targetdb) {
        this.recipeItemsTarget = targetdb.collection('product_items');
        this.recipeItemsSource = sourcedb.collection('product_clean');
    }

    migrateRecipeItems = () => {
        const self = this;

        this.recipeItemsSource.find({}).toArray(function (err, docs) {
            self.recipeItemsTarget.insertMany(docs.map(doc => ({
                defaultUnit: doc.unit,
                name: doc.name,
                category: doc.category
            })), function(err, result){
               if(err){
                   console.log('error', err);
               } 
            });
            self.resolver();
        })

        return new Promise(resolve => {
            self.resolver = resolve;
        });
    }

}

module.exports = MigrateData;