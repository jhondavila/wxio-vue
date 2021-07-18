
import Wx from 'Wx';
import PathVal from "../../util/Path";
import * as _ from 'lodash';
class Field {
    constructor(config) {

        // this.isDataField = true;
        // this.isField = true;
        // this.allowBlank = true;
        this.allowNull = false;
        // this.critical = false;

        // this.defaultInvalidMessage = "This field is invalid";
        this.defaultValue = undefined;

        this.mapping = null;
        this.mappingPath = null;
        this.name = null;
        this.persist = null;
        // this.path = true;
        // let validators;
        if (config) {
            if (Wx.isString(config)) {
                this.name = config;
            } else {
                // validators = config.validators;
                // if (validators) {
                //     delete config.validators;
                //     this.instanceValidators = validators;
                // }
                Wx.apply(this, config);
            }
        }

        if (this.persist === null) {
            this.persist = true;
        }

        // if (this.mapping) {
        //     if (!this.getter) {
        //         const name = this.name;
        //         const mapping = this.mapping;
        //         // if (this.path) {
        //         // this.getter = function () {
        //         //     return this.get(name) || PathVal.getValue(mapping,this._attributes);
        //         // }
        //         // } else {
        //         this.getter = function () {
        //             return this.get(name) || this.get(mapping);
        //         }

        //     }

        //     if (!this.setter) {
        //         const name = this.name;
        //         this.setter = function (value) {
        //             this.set(name, value);
        //         }
        //     }

        // }

        if (this.mapping) {
            this.buildMapping();
        }

        if (this.mappingTpl) {
            this.buildMappingTpl();
        }

        // let calculate, defaultValue, calculated;

        // calculate = this.calculate;

        // if (calculate) {
        //     this.convert = this.calculate;
        // }

        // defaultValue = this.defaultValue;
        // if (this.convert) {
        //     this.calculated = calculated = this.convert.length > 1;
        // }

        // this.cloneDefaultValue = defaultValue !== undefined && (Wx.isDate(defaultValue) || Wx.isArray(defaultValue) || Wx.isObject(defaultValue));
    }
    buildMappingTpl() {
        if (!this.getter) {
            const name = this.name;
            const mappingTpl = this.mappingTpl;
            this.getter = function () {
                return PathVal.getTplValue(mappingTpl, this, "");
            }
        }

        if (!this.setter) {
            // const name = this.name;
            this.setter = function (value) {
                // this.set(name, value);
            }
        }
    }

    buildMapping() {
        if (!this.getter) {
            const name = this.name;
            const mapping = this.mapping;
            this.getter = function () {
                return this.get(name) || PathVal.getValue(mapping, this);
            }
        }

        if (!this.setter) {
            const name = this.name;
            this.setter = function (value) {
                this.set(name, value);
            }
        }
    }

    isEqual(value1, value2) {
        return _.isEqual(value1, value2);
    }
}

export default Field;