import Field from './Field';

import PathVal from "../../util/Path";

class FInteger extends Field {

    type = "int";

    constructor(config) {
        super(config)
        this.isNumeric = true;
        this.isIntegerField = true;
        this.numericType = 'int';
    }

    convert(v) {
        // Handle values which are already numbers.
        // Value truncation behaviour of parseInt is historic and must be maintained.
        // parseInt(35.9)  and parseInt("35.9") returns 35
        if (typeof v === 'number') {
            return this.getNumber(v);
        }

        var empty = v === undefined || v === null || v === '',
            allowNull = this.allowNull,
            out;

        if (empty) {
            out = allowNull ? null : 0;
        } else {
            out = this.parse(v);
            if (allowNull && isNaN(out)) {
                out = null;
            }
        }
        return out;
    }


    // getType() {
    //     return this.numericType;
    // }

    parse(v) {
        return parseInt(String(v).replace(this.stripRe, ''), 10);
    }

    sortType(s) {
        // If allowNull, null values needed to be sorted last.
        if (s == null) {
            s = Infinity;
        }

        return s;
    }

    getNumber(v) {
        return parseInt(v, 10);
    }


    buildMapping() {
        if (!this.getter) {
            const name = this.name;
            const mapping = this.mapping;
            this.getter = function () {
                return typeof this.get(name) === "number" ? this.get(name) : this.get(name) || PathVal.getValue(mapping, this._attributes);
            }
        }

        if (!this.setter) {
            const name = this.name;
            this.setter = function (value) {
                this.set(name, value);
            }
        }
    }

}

export default FInteger;