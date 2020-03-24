const responseHandler = (resolver) => (err, result) => {
    if (resolver) resolver(result);
    if (err) {
        console.log('an error occurred', err);
    }
}
class DataCleaner {

    productCollection;
    ingredientsCollection;
    unitsCollection;
    units;
    recipesCollection;
    constructor(db) {
        this.rawCollection = db.collection('raw_recipes');

        this.recipesCollection = db.collection('recipes_clean');
        this.productCollection = db.collection('product_clean');
        this.ingredientsCollection = db.collection('ingredients');
        this.unitsCollection = db.collection('possible_units');
    }

    preprocessRawData = () => {
        console.log('processing raw recipes...');
        const self = this;
        let resolver;
        const run = () => {
            this.rawCollection.find({}).toArray(function (err, docs) {
                docs.forEach(doc => self.parseRecipe(doc));
                resolver();
            });
        }
        this.unitsCollection.find({}).toArray(function (err, docs) {
            self.units = docs.map(x => x._id);
            run();
        })

        return new Promise((resolve) => resolver = resolve);
    }

    parseRecipe = (doc) => {
        const self = this;
        const title = doc.title.trim();
        const ingredients = self.parseIngredients(doc);
        const stats = self.parseStats(doc);
        const instructions = doc.instructions.trim();

        self.productCollection.insertMany(ingredients.map(x => ({
            _id: x.name,
            unit: x.unit,
            name: x.name,
            category: x.category
        })), responseHandler())
        self.recipesCollection.insertOne({
            _id: title,
            title,
            stats,
            ingredients,
            instructions
        }, responseHandler());
    }

    parseStats = (doc) => {
        const parts = doc.stats.split('\n');

        const findStats = (index, list, amount, amountUnit, hours, minutes) => {
            if (amount && minutes || index > list.length - 1) {
                return {
                    amount,
                    amountUnit,
                    hours,
                    minutes
                };
            }
            const test = list[index];
            if (/\d/.test(test)) {

                const number = /\d*/.exec(test)[0];
                if (amount) {
                    let hourValue = 0;
                    let minuteValue = 0;
                    const hourMatch = /\d+\s(time(r)?)/.exec(test);
                    const minuteMatch = /\d+\s(minut(ter)?)/.exec(test);
                    if (hourMatch) {
                        hourValue = Number.parseInt(hourMatch[0].split(' ')[0]);
                    }
                    if (minuteMatch) {
                        minuteValue = Number.parseInt(minuteMatch[0].split(' ')[0]);
                    }
                    return findStats(index + 1, list, amount, amountUnit, hourValue, minuteValue);
                } else {
                    const unit = /[A-Za-z]+/.exec(test)[0];
                    return findStats(index + 1, list, number, unit, hours, minutes);
                }
            }
            return findStats(index + 1, list, amount, amountUnit, hours, minutes);
        }

        return findStats(0, parts);
    }

    parseIngredients = (doc) => {
        let possibleUnits = [];
        let possibleIngredients = [];
        const self = this;
        for (let i in doc.ingredients) {
            let ingredient = doc.ingredients[i].trim();
            // check if contains additional description
            // amount might be with ',' 

            let desc = "";
            let descParts = ingredient.substring(3, ingredient.length).split(',');
            if (descParts.length >= 2) {
                desc = descParts.slice(1).join(',');
                ingredient = ingredient.replace(desc, "");
            }

            const processParts = (index, list, amount, unit) => {
                const data = {
                    amount,
                    unit,
                    name: '',
                    category: 'food'
                }
                //can only be name
                if (index > list.length - 1) {
                    data.name = list[index - 1].replace(",", "");
                    return data;
                }
                //find amount
                if (/\d+((\.|\,|\/)\d+)?/.test(list[index])) {
                    let value = list[index].replace(',', '.');
                    if (value.includes("/")) {
                        const parts = value.trim().split("/");
                        value = Number.parseInt(parts[0]) / Number.parseInt(parts[1]);
                    } else {
                        value = Number.parseFloat(value);
                    }
                    return processParts(index + 1, list, value);
                }
                //find unit
                if (amount && index < 2 && self.units.includes(list[index])) {
                    return processParts(index + 1, list, amount, list[index]);
                }

                //found the name
                data.name = list.slice(index).join(' ').replace(",", "");
                return data;
            }

            const obj = processParts(0, ingredient.split(' '));
            obj.description = desc;

            //obj._id = obj.name;
            // if (obj.unit && !possibleUnits.includes(obj.unit)) {
            //     possibleUnits.push(obj.unit);
            // }
            possibleIngredients.push(obj);
        }

        //uncomments to get items only
        // this.ingredientsCollection.insertMany(possibleIngredients, function (err, response) {
        //     if (err) {
        //         console.log('error', err);
        //     }
        // });

        return possibleIngredients;

    }
}

module.exports = DataCleaner;