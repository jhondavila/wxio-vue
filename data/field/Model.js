import Field from './Field';

import Model from "../Model";
import Core from '../../core';
import * as _ from 'lodash';
import Vue from "vue";
class FModel extends Field {

    type = "model";

    isNested = true;

    ctModel = null;
    constructor(config) {
        super(config)
    }

    getData(v, model, options) {
        return v.getData(options);
    }

    register(parentModel, field) {
        let model;
        if (!this.ctModel) {
            this.ctModel = Model(field);
        }
        model = this.ctModel;

        let attribute;
        if (Core.isString(field)) {
            attribute = field;
        } else {
            attribute = field.name;
        }

        let RESERVED = parentModel.classCt.RESERVED;
        if (_.has(RESERVED, attribute)) {
            throw new Error(`Can't use reserved attribute name '${attribute}'`);
        }
        Object.defineProperty(parentModel, attribute, {
            get: () => {
                let attr = parentModel.get(attribute);
                return attr;
            },
            set: (value) => {
                let attr = parentModel.get(attribute);
                if (!attr) {
                    let initialized = this.applyInit(parentModel, field);
                    Vue.set(parentModel._attributes, attribute, initialized);
                    attr = initialized;
                }
                attr.set(value);
            }
        });

        if (!field.allowNull) {
            //si no permite nulos el campo, inicializamos un modelo ejemplo
            parentModel.set(attribute, new model(undefined, {
                modelParent: parentModel,
                ...field
            }));
        }


    }

    applyInit(parentModel, field) {
        let model;
        if (!this.ctModel) {
            this.ctModel = Model(field);
        }
        model = this.ctModel;


        let attribute;
        if (Core.isString(field)) {
            attribute = field;
        } else {
            attribute = field.name;
        }
        let modelChild = new model(undefined, {
            modelParent: parentModel,
            ...field
        });

        return modelChild;
    }

    applyCommit(value) {
        value.commit();
    }

    applyReset(value) {
        value.reset();
    }

    applyConfirm(value) {
        value.confirm();
    }

    applyCancelChanges(value) {
        value.cancelChanges();
    }

    applySet(model, value) {
        model.set(value);
    }

    changed(model) {
        return model.changed() ? true : false;
    }

}

export default FModel;