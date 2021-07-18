

export default {


    getValue(key, item, defaultValue) {
        const field = typeof key !== "object" ? key : key.field;
        let indexes = typeof field !== "string" ? [] : field.split(".");
        let value = defaultValue;

        if (!field) value = item;
        else if (indexes.length > 1)
            value = this.getValueFromNestedItem(item, indexes, defaultValue);
        else value = this.parseValue(item[field], defaultValue);

        if (key.hasOwnProperty("callback"))
            value = this.getValueFromCallback(value, key.callback, defaultValue);

        return value;
    },
    getTplValue(template, item, defaultValue) {
        const regex = /{[._-\w\s]*}/gmi;
        let strOut = template;
       
        template.match(regex).forEach((match, index) => {
            let key = match.slice(1, -1);
            const field = typeof key !== "object" ? key : key.field;
            let indexes = typeof field !== "string" ? [] : field.split(".");
            let value = defaultValue;

            if (!field) {
                value = item;
            }
            else if (indexes.length > 1) {
                value = this.getValueFromNestedItem(item, indexes, defaultValue);
            } else {
                value = this.parseValue(item[field], defaultValue);
            }
            if (key.hasOwnProperty("callback")) {
                value = this.getValueFromCallback(value, key.callback, defaultValue);
            }

            strOut = strOut.replace(match, value)
        });
        return strOut;
    },
    getValueFromNestedItem(item, indexes, defaultValue) {
        let nestedItem = item;
        for (let index of indexes) {
            if (nestedItem) nestedItem = nestedItem[index];
        }
        return this.parseValue(nestedItem, defaultValue);
    },
    getValueFromCallback(item, callback, defaultValue) {
        if (typeof callback !== "function") return defaultValue;
        const value = callback(item);
        return this.parseValue(value, parseValue);
    },
    parseValue(value, defaultValue) {
        return value || value === 0 ? value : defaultValue;
    }
}