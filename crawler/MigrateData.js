

const responseHandler = (resolver) => (err, result) => {
    if (resolver) resolver(result);
    if (err) {
        console.log('an error occurred', err);
    }
}

class MigrateData {

    recipeItemsTarget;
    recipeItemsSource;

    recipeIngredientsTarget;
    recipesTarget;
    recipeSource;

    resolver;
    constructor(sourcedb, targetdb) {
        this.recipeItemsSource = sourcedb.collection('product_clean');
        this.recipeSource = sourcedb.collection('recipes_clean');

        this.recipeItemsTarget = targetdb.collection('product_items');
        this.recipesTarget = targetdb.collection('recipes');
        this.recipeIngredientsTarget = targetdb.collection('components_product_recipe_items');
    }

    migrateRecipeItems = () => {
        console.log('populating strapi with recipe items...');
        const self = this;
        this.recipeItemsSource.find({}).toArray(function (err, docs) {
            self.recipeItemsTarget.insertMany(docs.map(doc => ({
                defaultUnit: doc.unit,
                name: doc.name,
                category: doc.category
            })), responseHandler());
            self.resolver();
        })
        return new Promise(resolve => self.resolver = resolve);
    }

    migrateRecipes = async () => {
        console.log('populating strapi with recipes...');
        const self = this;
        const docs = await this.getDocumentsFromSource();

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const items = await self.insertRecipeItems(doc);
            await self.insertRecipeToTarget(doc, items.insertedIds);
        }
    }

    insertRecipeToTarget = ({ title, introduction, instructions }, items) => {
        let resolver;
        const promise = new Promise(resolve => resolver = resolve);
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
        }, responseHandler(resolver))

        return promise;
    }

    insertRecipeItems = (doc) => {
        let resolver;
        const promise = new Promise(resolve => resolver = resolve);
        this.recipeIngredientsTarget.insertMany(
            doc.ingredients.map(({ name, description, amount, unit }) => ({
                name, description, amount, unit
            })), responseHandler(resolver));
        return promise;
    }

    getDocumentsFromSource = () => {
        let resolver;
        const promise = new Promise(resolve => resolver = resolve);
        this.recipeSource.find({}).toArray(responseHandler(resolver));
        return promise;
    }
}

module.exports = MigrateData;