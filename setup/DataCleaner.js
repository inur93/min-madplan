
class DataCleaner {

    units;
    constructor(_units) {
        this.units = _units;
    }

    cleanRecipe = (doc) => {
        const self = this;
        const title = doc.title.trim();
        const ingredients = self.parseIngredients(doc.ingredients);
        const stats = self.parseStats(doc.stats);
        const instructions = doc.instructions.trim();

        return {
            title,
            stats,
            instructions,
            ingredients
        }
    }

    parseStats = (rawStats) => {
        const parts = rawStats.split('\n');

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

    parseIngredients = (rawIngredients) => {
        let ingredients = [];
        const self = this;
        for (let i in rawIngredients) {
            let ingredient = rawIngredients[i].trim();
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
                    name: ''
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

            ingredients.push(obj);
        }

        return ingredients;
    }
}

module.exports = DataCleaner;