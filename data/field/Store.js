import Field from './Field';

import Model from "../Model";
import Core from '../../core';
import * as _ from 'lodash';

import Store from "../Store";

const excludeProps = ["mapping", "persist", "name", "mappingPath", "ctModel", "defaultValue", "isNested"];

class FStore extends Field {

    type = "store";
    isNested = true;
    constructor(config) {
        super(config)
    }

    getData(store, parentModel, options) {
        let data = [];
        store.each((i) => {
            data.push(i.getData(options));
        })
        return data;
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
                parentModel.set(attribute, value);
            }
        });
        let store = new Store(
            {
                model: model,
                modelParent: parentModel,
                ...field
            }
        );
        // debugger



        // Core.apply(store, field);


        for (let p in field) {
            if (excludeProps.indexOf(p) > -1) {
                continue;
            }
            store[p] = field[p];
        }



        parentModel.set(attribute, store);
    }


    applyCommit(store) {
        store.each((record) => {
            record.commit();
        });
    }

    applyReset(store) {
        store.each((record) => {
            record.reset();
        });

        //copiamos los records removidos para restaurarlos
        let removeRecords = store.removed.slice(0);

        //obtenemos los nuevos modelos para eliminarlos
        let newModels = store.getNewModels();

        //eliminamos los records
        store.remove(newModels);

        //limpiamos los records eliminados
        for (let x = 0; x < newModels.length; x++) {
            newModels[x].commit();
            Core.Array.remove(store.removed, newModels[x]);
        }

        //volvemos añadir los records que se habian eliminado
        store.add(removeRecords);

    }

    applyConfirm(store) {
        store.each((record) => {
            record.confirm();
        });
    }

    applyCancelChanges(store) {
        store.each((record) => {
            record.cancelChanges();
        });
        //copiamos los records removidos para restaurarlos
        let removeRecords = store.removed.slice(0);

        //obtenemos los nuevos modelos para eliminarlos
        let newModels = store.getNewModels();

        //eliminamos los records
        store.remove(newModels);

        //limpiamos los records eliminados
        for (let x = 0; x < newModels.length; x++) {
            newModels[x].commit();
            Core.Array.remove(store.removed, newModels[x]);
        }

        //volvemos añadir los records que se habian eliminado
        store.add(removeRecords);
    }

    applySet(store, value) {
        // deb
        let item;
        let modelStore = store.getOption("model");
        let emptyRecord = new modelStore({
        });
        // modelStore.clien
        let clientId = store.getOption("clientId") || emptyRecord.clientIdProperty;
        let propertyId = emptyRecord.idProperty;


        for (let x = 0; x < value.length; x++) {
            item = value[x];
            if (item._isModel) {
                store.add(item);
            } else {
                if (item.hasOwnProperty(clientId)) {
                    let record = store.getById(item[clientId]);
                    if (record) {
                        record.set(propertyId, item[propertyId]);
                        for (let p in item) {
                            record.set(p, item[p]);
                        }
                    }
                } else if (item.hasOwnProperty(propertyId)) {
                    let record = store.getById(item[propertyId]);
                    if (record) {
                        record.set(item);
                    } else {
                        store.add(item);
                    }
                } else {
                    store.add(item);
                }
            }
        }

    }

    changed(store) {
        return store.needsSync();
    }
}

export default FStore;