
import Model from './Model';

// console.log(Model);
class DataSession {

    constructor() {
        this.records = {};
        this.mapModels = {};
        this.models = [];
    }

    addModel(name, model, parent) {
        if (!this.mapModels[name]) {
            this.records[name] = {};
            this.mapModels[name] = model;
            if (!parent) {
                this.models.push(model);
            }
        }
        // console.log(this)
    }

    recordCreator(data, model) {
        console.log("recordCreator")
        // debugger
        // console.log(Model)
        let entityName = model.entityName;
        let idProperty = model.idProperty;
        let recordsEntity = this.records[entityName];
        let record = recordsEntity[data[idProperty]];
        if (record) {
            return record;
        } else {

            if (data instanceof model) {
                record = data;
                record.setOption("session", this);
            } else {
                record = new model(data, {
                    session: this
                });
            }

            recordsEntity[record.getId()] = record;
        }
        return record;
    }




}

export default DataSession;