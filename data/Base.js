import Vue from 'vue';
import Core from '../core';

class Base {


    ///Options 

    options() {
        return {

        }
    }

    defaults() {
        return {

        };
    }


    setOptions(options) {
        // debugger
        let opts = {};
        opts = Core.apply(opts, this.defaults());
        opts = Core.apply(opts, this.options());
        opts = Core.apply(opts, options);
        Vue.set(this, '_options', opts);
        // Vue.set(this, '_options', _.defaultsDeep(
        //     {},
        //     this.defaults(),             // Class defaults
        //     this.options(),             // Instance defaults
        //     options                 // Given options
        // ));
    }

    getOptions() {
        return _.defaultTo(this._options, {});
    }

    setOption(path, value) {
        _.set(this._options, path, value);
    }


    getOption(path, fallback = null) {
        return _.get(this._options, path, fallback);
    }



    constructor(options) {
        if (this.$class !== "Base") {
            this.classInitialize();
        }
        Vue.set(this, '_options', {});
        this.setOptions(options);
    }


    //class functional
    //class functional
    //class functional
    //class functional
    //class functional
    //class functional
    //class functional
    onExtend(constructor) { }

    classInitialize() {

        let prototype = Object.getPrototypeOf(this);
        let constructor = prototype.constructor;
        // console.log(constructor);
        if (!constructor.initialized) {
            let RESERVED = this.initReserved();

            Object.defineProperty(constructor, "RESERVED", {
                get: () => RESERVED,
                set: (value) => this.RESERVED = RESERVED,
            });

            Object.defineProperty(constructor, "initialized", {
                get: () => true,
                set: (value) => this.initialize = value,
            });

            this.onExtend(constructor);
        }
    }


    initReserved() {
        return [
            "_options"
        ];
    }


    get $class() {
        return (Object.getPrototypeOf(this)).constructor.name;
    }



    get classCt() {
        return Object.getPrototypeOf(this).constructor;
    }

}

export default Base;