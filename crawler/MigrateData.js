
class MigrateData {

    recipeItemsTarget;
    recipeItemsSource;

    recipeIngredientsTarget;
    recipesTarget;
    recipeSource;

    resolver;
    constructor(sourcedb, targetdb) {
        this.recipeItemsTarget = targetdb.collection('product_items');
        this.recipeItemsSource = sourcedb.collection('product_clean');

        this.recipeIngredientsTarget = targetdb.collection('components_product_recipe_items');
        this.recipesTarget = targetdb.collection('recipes');
        this.recipeSource = sourcedb.collection('recipes_clean');
    }

    migrateRecipes = async () => {
        const self = this;
        let resolver;
        const docs = await this.getDocuments();

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const items = await self.insertRecipeItems(doc);
            const result = await self.insertRecipe(doc, items.insertedIds);

            console.log('result', result);
        }
    }

    insertRecipe = ({ title, introduction, instructions }, items) => {
        let resolver;

        this.recipesTarget.insertOne({
            title, introduction, instructions,
            ingredients: Object.keys(items).map((key) => {
                const id = items[key];
                return {
                    _id: id,
                    ref: id,
                    kind: 'ComponentProductRecipeItem'
                }
            })
        }, function (err, result) {
            resolver();
        })
        return new Promise(resolve => {
            resolver = resolve;
        })
    }
    getDocuments = () => {
        let resolver;
        this.recipeSource.find({}).toArray(function (err, docs) {
            resolver(docs);
        })
        return new Promise(resolve => {
            resolver = resolve;
        })
    }

    insertRecipeItems = (doc) => {
        let resolver;
        this.recipeIngredientsTarget.insertMany(doc.ingredients.map(({ name, description, amount, unit }) => ({
            name, description, amount, unit
        })), function (err, result) {
            if (err) {
                console.log('error', err);
            } else {
                resolver(result);
            }
        });
        return new Promise(resolve => {
            resolver = resolve;
        })
    }

    migrateRecipeItems = () => {
        const self = this;

        this.recipeItemsSource.find({}).toArray(function (err, docs) {
            self.recipeItemsTarget.insertMany(docs.map(doc => ({
                defaultUnit: doc.unit,
                name: doc.name,
                category: doc.category
            })), function (err, result) {
                if (err) {
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