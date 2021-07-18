
import Vue from 'vue'
import Base from "../../../data/Base";
import Core from "../../../core";

import * as _ from 'lodash';

class BaseColumn extends Base {

    constructor(attributes) {
        super();
        // this.align = "left";
        // this.titleAlign = "";
        // this.renderer = null;
        // Object.assign(this, config);
        Vue.set(this, '_attributes', {});

        this.addAttributes(
            {
                width: undefined,
                minWidth: undefined,
                computedWidth: undefined,
                label: undefined,
                renderer: undefined,
                _index: undefined,
                textAlign: "center",
                titleAlign: null,
                verticalAlign: "middle",
                verticalTitleAlign: null
            }
        );
        this.set(attributes);

        // console.log("from base column")

    }

    addAttributes(attributes) {
        // let attributes = this.defaultAttributes();
        // let field;
        for (let p in attributes) {
            this.set(p, attributes[p]);
        }
    }


    set(property, v) {
        // console.log("set to property : " + property)
        let single = Core.isString(property);
        let attributes;
        if (single) {
            attributes = {};
            attributes[property] = v;
        } else {
            attributes = property;
        }
        for (let attribute in attributes) {
            let value = attributes[attribute];
            let defined = this.has(attribute);
            if (!defined) {
                this.registerAttribute(attribute);
            }
            Vue.set(this._attributes, attribute, value);
        }



    }

    registerAttribute(attribute, isStore) {
        // Protect against unwillingly using an attribute name that already
        // exists as an internal property or method name.
        // let attribute;
        // if (Core.isString(field)) {
        //     attribute = field;
        // } else {
        //     attribute = field.name;
        // }

        let RESERVED = this.classCt.RESERVED;
        if (_.has(RESERVED, attribute)) {
            throw new Error(`Can't use reserved attribute name '${attribute}'`);
        }
        // Create dynamic accessors and mutations so that we can update the
        // model directly while also keeping the model attributes in sync.
        // console.log(field.name)
        // console.log(attribute)
        Object.defineProperty(this, attribute, {
            get: () => this.get(attribute),
            set: (value) => this.set(attribute, value)
            // set: field.setter ? (value) => {
            //     field.setter(attribute, value);
            // } : (value) => this.set(attribute, value)
            // set: (value) => this.set(attribute, value),
        });



    }

    has(attribute) {
        // console.log("has", attribute)
        if (this._attributes.hasOwnProperty(attribute)) {
            return true;
        } else if (this._attributes[attribute] !== undefined) {
            return true;
        } else {
            return false;
        }
    }


    get(attribute, fallback) {
        return _.get(this._attributes, attribute, fallback);
    }


    get attributes() {
        return this._attributes;
    }

    get $() {
        return this._attributes;
    }


    getValue(key, item) {
        const field = typeof key !== "object" ? key : key.field;
        let indexes = typeof field !== "string" ? [] : field.split(".");
        let value = this.defaultValue;

        if (!field) value = item;
        else if (indexes.length > 1)
            value = this.getValueFromNestedItem(item, indexes);
        else value = this.parseValue(item[field]);

        if (key.hasOwnProperty("callback"))
            value = this.getValueFromCallback(value, key.callback);

        return value;
    }
    getValueFromNestedItem(item, indexes) {
        let nestedItem = item;
        for (let index of indexes) {
            if (nestedItem) nestedItem = nestedItem[index];
        }
        return this.parseValue(nestedItem);
    }
    getValueFromCallback(item, callback) {
        if (typeof callback !== "function") return this.defaultValue;
        const value = callback(item);
        return this.parseValue(value);
    }
    parseValue(value) {
        return value || value === 0 ? value : this.defaultValue;
    }
}

export default BaseColumn;
