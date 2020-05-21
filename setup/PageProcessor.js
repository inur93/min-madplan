const axios = require('axios');
const html2parser = require('htmlparser2');
const Url = require('url-parse');
const types = {
    ingredientList: 'ingredientList',
    ingredient: 'ingredient',
    instructions: 'instructions',
    headline: 'headline',
    stats: 'stats'
}

class PageProcessor {

    urls = [];
    ingredients = [];
    title = "";
    stats = {
        text: "",
        tag: "",
        depth: 0
    };
    currentIngredient = { name: "" };
    instructions = {
        text: "",
        depth: 0,
        tag: ""
    }
    readingType = null;
    
    parser;
    constructor() {
        const self = this;
        this.parser = new html2parser.Parser({
            onopentag(name, attr) {
                const data = { type: 'open', name, attr };
                self.parseIngredients(data);
                self.parseInstructions(data);
                self.parseUrls(data);
                self.parseHeadline(data);
                self.parseStats(data);
            },
            ontext(text) {
                const data = { type: 'text', text };
                self.parseIngredients(data);
                self.parseInstructions(data);
                self.parseHeadline(data);
                self.parseStats(data);
            },
            onclosetag(name) {
                const data = { type: 'close', name };
                self.parseIngredients(data);
                self.parseInstructions(data);
                self.parseHeadline(data);
                self.parseStats(data);
            }
        },
            {
                decodeEntities: true
            }
        );
    }
    run = async (url) => {
        const result = await axios.get(url);
        this.parser.write(result.data);
        this.parser.end();
        return {
            title: this.title,
            instructions: this.instructions.text,
            ingredients: this.ingredients.map(x => x.name),
            urls: this.urls,
            stats: this.stats.text
        }
    }

    parseStats = ({ type, name, attr, text }) => {
        switch (type) {
            case 'open':
                if (attr.class && attr.class.includes('recipe-stats')) {
                    this.readingType = types.stats;
                    this.stats.depth = 1;
                    this.stats.tag = name;
                }
                if (this.readingType === types.stats && name === this.stats.tag) {
                    this.stats.depth += 1;
                }
                break;
            case 'text':
                if (this.readingType === types.stats) {
                    this.stats.text += (text || "").trim();
                }
                break;
            case 'close':
                if (this.readingType === types.stats) {
                    if (name === this.stats.tag) {
                        this.stats.depth -= 1;
                        if (this.stats.depth === 0) {
                            this.readingType = null;
                        }
                    }
                    this.stats.text += '\n';
                }
                break;
        }
    }

    parseUrls = ({ type, name, attr, text }) => {
        if (name === 'a' && attr.href !== "#") {
            const url = new Url(attr.href);
            if (url.host !== '' && url.pathname !== '/') {
                this.urls.push(attr.href);
            }
        }
    }

    parseHeadline = ({ type, name, attr, text }) => {
        switch (type) {
            case 'open':
                if (name === 'h1' && attr.itemprop && attr.itemprop.includes('headline')) {
                    this.readingType = types.headline;
                }
                break;
            case 'text':
                if (this.readingType === types.headline) {
                    this.title += text;
                }
                break;
            case 'close':
                if (this.readingType === types.headline) {
                    this.readingType = null;
                }
                break;
        }
    }

    parseIngredients = ({ type, name, attr, text }) => {
        switch (type) {
            case 'open':
                if (name === "ul" && attr.class && attr.class.includes("ingredientlist")) {
                    this.readingType = types.ingredientList;
                    return;
                }
                if (this.readingType === types.ingredientList
                    && name === "li"
                    && attr.itemprop) {
                    if (attr.itemprop === 'recipeIngredient') {
                        this.readingType = types.ingredient;
                    }
                }
                break;
            case 'text':
                if (this.readingType === types.ingredient) {
                    this.currentIngredient.name += text;
                }
                break;
            case 'close':
                if (name === 'li' && this.readingType === types.ingredient) {
                    this.ingredients.push(this.currentIngredient);
                    this.currentIngredient = { name: "" };
                    this.readingType = types.ingredientList;
                }
                if (name === 'ul' && this.readingType === types.ingredientList) {
                    this.readingType = null;
                }
                break;
        }
    }

    parseInstructions = function ({ type, name, attr, text }) {
        switch (type) {
            case 'open':
                if (attr.itemprop && attr.itemprop.includes('recipeInstructions')) {
                    this.readingType = types.instructions;
                    this.instructions.depth = 1;
                    this.instructions.tag = name;
                }
                if (this.readingType === types.instructions && name === this.instructions.tag) {
                    this.instructions.depth += 1;
                }
                break;
            case 'text':
                if (this.readingType === types.instructions) {
                    this.instructions.text += text;
                }
                break;
            case 'close':
                if (this.readingType === types.instructions) {
                    if (name === this.instructions.tag) {
                        this.instructions.depth -= 1;
                        if (this.instructions.depth === 0) {
                            this.readingType = null;
                        }
                    }
                    this.instructions.text += '\n';
                }
                break;
        }
    }
}

module.exports = PageProcessor;