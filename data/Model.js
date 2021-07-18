
import * as _ from 'lodash';
import Vue from 'vue'

import Wx from '../core';

import SeqNegative from './identifier/Negative';


import Base from './Base';

import utils from './utils';
import Core from '../core';

import Store from './Store';


import PathVal from "../util/Path";


import ProxyAjax from './proxy/Ajax';
import ProxyForm from './proxy/Form';
import ProxyMemory from './proxy/Memory';




let fnCt = function (options) {

    options = options || {};

    let idProperty = options.idProperty || "id";

    let fields = options.fields || {};
    if (!fields[idProperty]) {

        fields[idProperty] = {
            persist: true
        };
    }

    let compileFields = utils.compileFields(fields);

    let fileSupport = false;
    let criticalFields = [];
    let subStoreFields = [];
    // let defaultFields = [];

    for (let p in compileFields) {
        if (compileFields[p].type === "file") {
            fileSupport = true;
        }
        // if (compileFields[p].type === "store") {
        //     subStoreFields.push(compileFields[p].name);
        // }

        if (compileFields[p].critical) {
            criticalFields.push(compileFields[p].name);
        }

    }

    // let proxy = options.proxy;
    // Core.apply(proxy, {
    //     model: this,
    //     store: this
    // })
    let proxy = options.proxy;
    if (proxy) {
        if (proxy.type === "ajax") {
            proxy = new ProxyAjax(proxy);
        } else if (proxy.type === "form") {
            proxy = new ProxyForm(proxy);
        } else if (proxy.type === "memory") {
            proxy = new ProxyMemory(proxy);
        }
    }




    class Model extends Base {

        get idProperty() {
            return idProperty;
        }

        // fields() {
        //     return {

        //     };
        // }

        clientIdProperty = "clientId";

        fileSupport = fileSupport;

        _isModel = true;

        initAttributes(attributes) {
            let field;
            for (let p in this._fields) {
                field = this._fields[p];
                if (field.isNested) {
                    this.registerNestedField(field);
                } else {
                    this.registerAttribute(field);

                    if (field.defaultValue !== undefined) {
                        let value = Core.isFunction(field.defaultValue) ? field.defaultValue : field.defaultValue;
                        this.set(field.name, value);
                    }


                    if (field.mapping) {
                        let value = attributes[field.mapping] || PathVal.getValue(field.mapping, attributes);
                        this.set(field.name, value);
                    }

                    // if (field.mappingPath) {
                    //     let value = PathVal.getValue(field.mappingPath, attributes);
                    //     this.set(field.name, value);
                    // }
                }
            }

        }

        constructor(attributes, options) {

            super(options);

            this.internalId = Wx.classId(this);
            Vue.set(this, '_fields', compileFields);//primero se indican los campos
            Vue.set(this, '_attributes', {});//se inicializan todos los atributos del modelo
            Vue.set(this, '_commitValues', {});//se crea una pequeña cache con los ultimos valores confirmados por el servidor
            Vue.set(this, '_previousValues', {});//se crea una pequeña cache con los valores previos
            Vue.set(this, '_stores', []);//se crea una  para saber con que objetos esta relacionado el modelo

            this.initAttributes(attributes);
            this.set(attributes); //se asignan los atributos pasados al modelo
            if (!this.get(this.idProperty)) {
                Vue.set(this, "phantom", true);
                this.set(this.idProperty, this.generateId());
            } else {
                this.commit();
            }

            let data = this.getData({
                serialize: true,
                persist: true,
                nested: false
            });
            Vue.set(this, '_previousValues', _.cloneDeep(data));

            // if (this.getOption("proxy")) {
            //     // debugger
            //     this.initProxy();
            // }
        }




        _addTocompileFields(attribute) {
            console.warn(`La propiedad "${attribute}" no se encuentra registrada en el modelo añadiendo`);
            compileFields[attribute] = utils.createField(attribute);
        }


        identifier() {
            return SeqNegative;
        }


        get prefixId() {
            return "ID_"
        }

        getCommitValue(key) {
            if (this.phantom) {
                this[key];
            } else {
                return this._commitValues[key];
            }
        }

        set(property, v) {
            // console.log(property,v)
            let single = Wx.isString(property);
            let attributes;
            if (single) {
                attributes = {};
                attributes[property] = v;
            } else {
                attributes = property;
            }


            let changeId = false;
            let oldId;
            let newId;
            for (let attribute in attributes) {
                let value = attributes[attribute];
                let field = this._fields[attribute];
                let defined = this.has(attribute);
                if (!defined) {
                    this.registerAttribute(attribute);
                    this._addTocompileFields(attribute);
                    field = this._fields[attribute];
                }
                value = this.convert(attribute, value);

                let previous = this.get(attribute);

                let changed;

                if (field && field.isNested) {
                    if (previous) {
                        field.applySet(previous, value);
                        changed = field.changed(previous);
                    } else if (!previous && !field.allowNull) {
                        // debugger
                        Vue.set(this._attributes, attribute, value);
                        changed = defined && field.persist && !field.isEqual(previous, value);
                        if (Core.isArray(previous) && Core.isArray(value)) {
                            if (previous !== value) {
                                changed = true;
                            }
                        }

                    } else if (!previous && field.allowNull) {
                        let initialized = field.applyInit(this, field);
                        Vue.set(this._attributes, attribute, initialized);
                        previous = initialized;
                        field.applySet(previous, value);
                        changed = field.changed(previous);
                    }
                } else {
                    Vue.set(this._attributes, attribute, value);
                    changed = defined && field.persist && !field.isEqual(previous, value);

                    if (Core.isArray(previous) && Core.isArray(value)) {
                        if (previous !== value) {
                            changed = true;
                        }
                    }
                }


                if (changed) {
                    // Vue.set(this, "dirty", true);
                    this.setDirty(true);
                    if (this.idProperty === attribute) {
                        changeId = true;
                        oldId = previous;
                        newId = value;
                    }
                }
            }
            if (changeId) {
                this.callJoinCollection("onIdChanged", this, oldId, newId);
            }

            this.callJoinCollection("onDataChanged");

        }


        convert(attribute, value) {

            let field = _.get(this._fields, attribute);
            if (field && field.convert) {
                try {
                    return field.convert(value, this._attributes);
                } catch (error) {
                    console.log(error);
                }
            }

            return value;
        }
        registerNestedField(field) {
            field.register(this, field);
        }
        registerAttribute(field, isStore) {
            // Protect against unwillingly using an attribute name that already
            // exists as an internal property or method name.
            let attribute;
            if (Core.isString(field)) {
                attribute = field;
            } else {
                attribute = field.name;
            }

            // console.log(field)

            let RESERVED = this.classCt.RESERVED;
            if (_.has(RESERVED, attribute)) {
                throw new Error(`Can't use reserved attribute name '${attribute}'`);
            }
            // Create dynamic accessors and mutations so that we can update the
            // model directly while also keeping the model attributes in sync.

            // console.log(attribute, field.getter)
            Object.defineProperty(this, attribute, {
                get: field.getter ? field.getter.bind(this) : () => this.get(attribute),
                set: field.setter ? field.setter.bind(this) : (value) => this.set(attribute, value)
            });
        }


        get attributes() {
            return this._attributes;
        }

        get $() {
            return this._attributes;
        }

        get isModel() {
            return true;
        }

        getId() {
            return this.get(this.idProperty);
        }

        get(attribute, fallback) {
            return _.get(this._attributes, attribute, fallback);
        }


        has(attribute) {

            if (this._fields[attribute]) {
                // console.log(attribute,true);
                return true;
            } else if (this._attributes[attribute] !== undefined) {
                // console.log(attribute,true);
                console.warn(`La propiedad "${attribute}" no se encuentra registrada en el modelo`);
                return true;
            } else {
                return false;
            }
        }

        setDirty(value) {
            Vue.set(this, "dirty", value);
            if (this.getOption("modelParent")) {
                let modelParent = this.getOption("modelParent");
                modelParent.onDirtyChildModel(this);
            }
        }

        onDirtyChildModel(childModel) {
            if (childModel.changed()) {
                this.setDirty(true);
            }
        }

        onDirtyChildStore(childStore) {
            if (childStore.needsSync()) {
                this.setDirty(true);
            }
        }

        confirm() {
            // 
            if (!this.phantom) {
                this.setDirty(this.changed() ? true : false)
                // Vue.set(this, "dirty", this.changed() ? true : false);
            }
            this._eachNestedTypes((field, value) => {
                field.applyConfirm(value);
            });
            this.copyToPreviousValue(this._attributes, this._previousValues);
        }

        reset(attribute) {
            if (attribute) {
                this.copyToAttributes(this._previousValues, this._attributes, _.castArray(attribute));
            } else {
                this.copyToAttributes(this._previousValues, this._attributes);
                this._eachNestedTypes((field, value) => {
                    field.applyReset(value);
                });
            }
            this.setDirty(false);
        }


        //Attributes
        cancelChanges() {
            //cancela los cambios realizados
            if (this.phantom) {

                this.copyToAttributes(this._previousValues, this._attributes);

            } else {

                this.copyToAttributes(this._commitValues, this._attributes);

            }
            this._eachNestedTypes((field, value) => {
                field.applyCancelChanges(value);
            });
            this.setDirty(false)
            // Vue.set(this, "dirty", false);
        }

        getPreviousValues() {
            if (this.phantom) {
                return this._previousValues;
            } else {
                return this._commitValues;
            }
        }


        copyToPreviousValue(source, target, keys) {
            if (keys) {
                source = _.pick(source, keys);
            }

            _.each(source, (value, key) => {
                let field = this._getField(key);
                if (field && field.isNested) {

                } else {
                    target[key] = _.cloneDeep(value);
                    // this.set(key, _.cloneDeep(value));
                    // Vue.set(target, key, );
                }
            });
        }

        copyToAttributes(source, target, keys) {

            if (keys) {
                source = _.pick(source, keys);
            }

            _.each(source, (value, key) => {
                let field = this._getField(key);
                if (field && field.isNested) {

                } else {
                    this.set(key, _.cloneDeep(value));
                    // Vue.set(target, key, );
                }
            });
        }

        _eachNestedTypes(fn) {

            let fieldsMap = this._fields;

            for (let fieldKey in fieldsMap) {
                let field = fieldsMap[fieldKey];
                if (field.isNested) {
                    let attribute = this.get(fieldKey);
                    if (attribute) {
                        fn(field, attribute);
                    }
                }
            }

        }
        commit(silent, modifiedFieldNames, nested) {
            if (!nested) {
                this._eachNestedTypes((field, value) => {
                    field.applyCommit(value);
                });
            }
            Vue.set(this, "phantom", false);
            this.setDirty(false);
            if (this.dropped) {
                Vue.set(this, "erased", true);
            }
            let data = this.getData({
                serialize: true,
                persist: true,
                nested: false
            });
            Vue.set(this, '_commitValues', _.cloneDeep(data));
            Vue.set(this, '_previousValues', _.cloneDeep(data));
            // debugger
        }

        setPhantom(value) {
            Vue.set(this, "phantom", value);

        }
        _getField(attribute) {
            return this._fields[attribute];
        }

        getFiles(options) {
            let changes = options.changes,
                data = this._attributes,
                fieldsMap = this._fields;
            let content = changes ? _.pick(this._attributes, this.changed()) : this._attributes;
            let ret = [];
            if (content) {
                for (name in content) {
                    let value = data[name];
                    let field = fieldsMap[name];
                    if (!field) {
                        continue;
                    }
                    if (field.type === "file") {
                        ret.push({
                            field: name,
                            file: value
                        });
                    }
                }
            }
            // console.log(ret);
            return {
                id: this.getId(),
                idProperty: this.idProperty,
                files: ret
            };
        }

        getData(options) {
            options = options || {
                serialize: true,
                persist: true,
                nested: true
            };

            let serialize = options.serialize,
                persist = options.persist,
                changes = options.changes,
                nested = options.nested,
                foreignKey = options.foreignKey,
                modelParent = options.modelParent,
                fieldsMap = this._fields,
                // form = options.form,
                data = this._attributes;

            let content = changes ? _.pick(this._attributes, this.changed()) : this._attributes;
            // console.log(content)
            let ret = {};
            // 
            let name;
            if (content) {
                for (name in content) {
                    let value = data[name];
                    let field = fieldsMap[name];
                    // 
                    if (field) {
                        // console.log(persist && !field.persist)
                        if (persist && !field.persist) {
                            continue;
                        }
                        if (field.isNested && nested) {
                            value = field.getData(value, this, options);
                        } else if (field.isNested && !nested) {
                            continue;
                        }

                        if (serialize && field.serialize) {
                            value = field.serialize(value, this, options);
                        }
                    }
                    ret[name] = value;
                }
            }
            // 

            let critical = _.pick(this._attributes, criticalFields)

            // 
            if (critical) {
                for (name in critical) {
                    let value = data[name];
                    let field = fieldsMap[name];
                    if (field) {

                        if (serialize && field.serialize) {
                            value = field.serialize(value, this);
                        }
                    }
                    ret[name] = value;
                }
            }

            if (modelParent && foreignKey) {
                ret[foreignKey] = modelParent.getId();
            }

            ret[this.idProperty] = this.getId();
            return ret;
        }

        changed() {
            let changed = [];
            let fieldsMap = this._fields;

            for (let attribute in this._attributes) {
                let value = this._attributes[attribute];
                let field = fieldsMap[attribute];
                if (field && !field.persist) {
                    continue;
                }
                if (field && field.isNested) {
                    if (!value.changed()) {
                        continue;
                    }
                } else if (field) {
                    if (field.isEqual(value, this.saved(attribute))) {
                        continue;
                    }
                } else {
                    if (_.isEqual(value, this.saved(attribute))) {
                        continue;
                    }
                }

                changed.push(attribute);
            }

            return !_.isEmpty(changed) ? changed : false;
        }

        saved(attribute, fallback) {
            return _.get(this._commitValues, attribute, fallback);
        }

        registerCollection(store) {
            Core.Array.include(this._stores, store);
        }

        callJoinCollection(method) {
            let store, fn;
            for (let x = 0; x < this._stores.length; x++) {
                store = this._stores[x];
                fn = store[method];
                fn.apply(store, Array.prototype.slice.call(arguments, 1));
            }
        }

        //class functional
        //class functional
        //class functional
        //class functional
        //class functional
        //class functional
        //class functional

        onExtend(constructor) {
            let clsIdentifier = this.identifier();
            let identifier = new clsIdentifier({
                prefix: this.prefixId
            });
            Object.defineProperty(constructor, "identifier", {
                get: () => identifier,
                set: (value) => this.identifier = value,
            });

        }


        generateId() {
            let prototype = Object.getPrototypeOf(this);
            let constructor = prototype.constructor;
            return constructor.identifier.generate();
        }

        initReserved() {
            let RESERVED = super.initReserved();
            RESERVED.push(
                "_attributes",
                "_previousValues",
                "_fields",
                "isModel"
            );
            return RESERVED;
        }

        drop() {
            Vue.set(this, "dropped", true);
        }


        // initProxy() {
        //     let proxy = this.getOption("proxy") || this.proxy();
        //     Core.apply(proxy, {
        //         model: this,
        //         store: this
        //     })
        //     if (proxy.type === "ajax") {
        //         this.setOption("proxy", new ProxyAjax(proxy));
        //     } else if (proxy.type === "form") {
        //         this.setOption("proxy", new ProxyForm(proxy));
        //     } else if (proxy.type === "memory") {
        //         this.setOption("proxy", new ProxyMemory(proxy));
        //     }
        // }

        getById(id) {
            if (this.id == this.getId()) {
                return this;
            }
        }
        needsSync() {
            let needsSync = false;

            if (this.phantom) {
                needsSync = true;
            }

            if (!this.phantom && this.dirty && !this.dropped) {
                needsSync = true;
            }

            if (this.dropped) {
                needsSync = true;
            }

            return needsSync;
        }
        async sync(options) {
            let operations = {};
            let needsSync = false;

            if (this.phantom) {
                operations.create = [this];
                needsSync = true;
            }

            if (!this.phantom && this.dirty && !this.dropped) {
                operations.update = [this];
                needsSync = true;
            }

            if (this.dropped) {
                operations.destroy = [this];
                needsSync = true;
            }

            if (needsSync) {
                try {
                    Vue.set(this, 'isSyncing', true);
                    // let proxy = this.getOption("proxy");
                    await proxy.batch(operations, this);
                    Vue.set(this, 'isSyncing', false);
                    return true;
                } catch (error) {
                    console.log(error)
                    Vue.set(this, 'isSyncing', false);
                    if (options && options.catchError) {
                        return {
                            error: error,
                            request: error.request,
                            response: Core.JSON.decode(error.request.responseText, true)
                        };
                    } else {
                        return false;
                    }

                }
            } else {
                return true;
            }


        }

    }
    Model.entityName = options.name;
    Model.idProperty = options.idProperty || "id";
    return Model;
}

export default fnCt;