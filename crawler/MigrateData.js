
class MigrateData {

    recipeItemsTarget;
    recipeItemsSource;
    resolver;
    constructor(sourcedb, targetdb) {
        this.recipeItemsTarget = targetdb.collection('recipe_items');
        this.recipeItemsSource = sourcedb.collection('ingredients');
    }

    migrateRecipeItems = () => {
        const self = this;
        this.recipeItemsSource.find({}).toArray(function (err, docs) {
            self.recipeItemsTarget.insertMany(docs.map(doc => ({
                unit: doc.unit,
                name: doc.name
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