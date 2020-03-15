


class DataCleaner {

    resolver;

    productCollection;
    ingredientsCollection;
    unitsCollection;
    units;
    recipesCollection;
    constructor(db) {
        this.recipesCollection = db.collection('recipes_clean');
        this.productCollection = db.collection('product_clean');
        this.rawCollection = db.collection('raw_recipes');
        this.ingredientsCollection = db.collection('ingredients');
        this.unitsCollection = db.collection('possible_units');
    }

    clean = () => {
        const self = this;

        const run = () => {
            this.rawCollection.find({}).toArray(function (err, docs) {
                docs.forEach(doc => {
                    const title = doc.title.trim();
                    const ingredients = self.cleanIngredients(doc);
                    const stats = self.cleanStats(doc);
                    const instructions = doc.instructions.trim();
                    self.productCollection.insertMany(ingredients.map(x => ({
                        _id: x.name,
                        unit: x.unit,
                        name: x.name,
                        category: x.category
                    })))
                    self.recipesCollection.insertOne({
                        _id: title,
                        title,
                        stats,
                        ingredients,
                        instructions
                    });
                });
                self.resolver();
            });
        }
        this.unitsCollection.find({}).toArray(function (err, docs) {
            self.units = docs.map(x => x._id);
            run();
        })

        return new Promise((resolve) => {
            self.resolver = resolve;
        });
    }

    cleanStats = (doc) => {
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

    cleanIngredients = (doc) => {
        let possibleUnits = [];
        let possibleIngredients = [];
        const self = this;
        for (let i in doc.ingredients) {
            const ingredient = doc.ingredients[i].trim();
            // check if contains additional description
            const parts = ingredient.split(',');

            let desc = "";
            if (parts.length >= 2) {
                desc = parts.slice(1).join(',');
            }

            const findUnit = (index, list, amount, unit) => {
                const data = {
                    amount,
                    unit,
                    name: '',
                    category: 'food'
                }
                if (index > list.length - 1) {
                    data.name = list[index - 1];
                    return data;
                }
                if (/\d/.test(list[index])) {
                    return findUnit(index + 1, list, list[index]);
                }
                if (amount && index < 2 && self.units.includes(list[index])) {
                    return findUnit(index + 1, list, amount, list[index]);
                }

                data.name = list.slice(index).join(' ');
                return data;
            }

            const obj = findUnit(0, parts[0].split(' '));
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