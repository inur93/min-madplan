const testFunction = function({ type, name, attr, text }, {
    readingType }) {
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