
import Vue from 'vue'
import ModelCt from './Model';
import Base from './Base';

import * as _ from 'lodash';

import ProxyAjax from './proxy/Ajax';
import ProxyForm from './proxy/Form';
import ProxyMemory from './proxy/Memory';

import Core from '../core';
import DataSession from './Session';


class Store extends Base {


    sorters = [];

    currentPage = 0;
    pageSize = 100
    // start = 0;
    // limit = 100;

    session() {
        return;
    }
    setExtraParams(params) {
        Vue.set(this, 'extraParams', params);
    }

    addFilters(filter) {
        this.filters.push(filter);
    }

    cleatFilters() {
        this.filters.splice(0);
        Vue.set(this, 'filters', this.filters);
    }

    setFilters(name, value) {
        let filters = [];
        if (Core.isObject(name)) {
            filters.push(name);
        } else if (Core.isArray(name)) {

            name.forEach((item) => {
                filters.push(item);
            });

        } else {
            filters.push({
                property: name,
                value: value
            });
        }
        Vue.set(this, 'filters', filters);


    }
    filter(name, value) {

        if (Core.isObject(name)) {

            this.filters.push(name);


        } else if (Core.isArray(name)) {

            name.forEach((item) => {
                this.filters.push(item);
            });

        } else {


            this.filters.push({
                property: name,
                value: value
            });
        }


    }

    proxy() {
        return {
            type: "ajax"
        };
    }


    model() {
        return ModelCt({
            fields: {

            }
        });
    }

    defaults() {
        return {
            clearOnPageLoad: true
        };
    }


    count() {
        return this.data.length;
    }
    constructor(options) {
        super(options);
        // console.log(options)

        Vue.set(this, 'data', []);
        Vue.set(this, "removed", []);
        Vue.set(this, 'mapping', {});

        Vue.set(this, 'loading', false);
        Vue.set(this, 'isSyncing', false);

        Vue.set(this, 'filters', []);
        Vue.set(this, 'extraParams', {});

        this.initModel();
        this.initProxy();
        this.initSession();

    }

    initSession() {
        let session = this.getOption("session") || this.session();
        if (session) {
            if (session.parent) {
                session = new DataSession(session);
            }
            this.setOption("session", session);
            let model = this.getOption("model");
            let entityName = model.entityName;
            session.addModel(entityName, model);
        }
    }

    getModel() {
        let model = this.getOption("model");
        return model || this.model();
    }
    initModel() {
        let model = this.getOption("model");
        this.setOption("model", model || this.model());
    }

    initProxy() {
        let proxy = this.getOption("proxy") || this.proxy();
        Core.apply(proxy, {
            model: this.getOption("model"),
            store: this
        })
        // debugger
        // console.log(proxy)
        if (proxy.type === "ajax") {
            this.setOption("proxy", new ProxyAjax(proxy));
        } else if (proxy.type === "form") {
            this.setOption("proxy", new ProxyForm(proxy));
        } else if (proxy.type === "memory") {
            this.setOption("proxy", new ProxyMemory(proxy));
        }

        // console.log(this.getOption("proxy"))
    }


    async load() {
        // console.log("load");
        let proxy = this.getOption("proxy");
        try {
            Vue.set(this, 'loading', true);

            let rs = await proxy.load();
            let data = rs.data;
            let propData = data.data;
            // console.log(this.getOption("clearOnPageLoad"))
            if (this.getOption("clearOnPageLoad")) {
                this.clearLoad();
            }
            this.add(propData);
            Vue.set(this, 'loading', false);
            return true;
        } catch (error) {
            console.log(error)
            Vue.set(this, 'loading', false);
            return false;
        }
    }


    async nextPage() {
        return await this.loadPage(this.currentPage + 1);
    }


    async  loadPage(page, clear) {
        let size = this.pageSize;
        this.currentPage = page;
        let options = {
            page: page,
            start: (page - 1) * size,
            limit: size
        };
        let proxy = this.getOption("proxy");
        try {
            Vue.set(this, 'loading', true);
            let rs = await proxy.load(options);
            let data = rs.data;
            let propData = data.data;
            if (clear) {
                this.clearLoad();
            }
            let records = this.add(propData);
            Vue.set(this, 'loading', false);
            return {
                success: true,
                complete: records.length > 0 ? false : true
            };
        } catch (error) {
            Vue.set(this, 'loading', false);
            return {
                success: false,
                // complete: false,
                error: true
            };
        }
    }


    clearLoad() {
        this.data.splice(0);
        Vue.set(this, 'mapping', {});
    }

    clear() {
        this.clearLoad();
    }

    add(models) {
        if (!models) {
            return [];
        }
        if (!Core.isArray(models)) {
            models = [models];
        }
        let items = [], model,
            modelBase = this.getOption("model");

        let session = this.getOption("session");
        models.forEach((item) => {
            if (session) {
                model = session.recordCreator(item, modelBase);
            } else if (item.isModel) {
                model = item;
            } else {
                model = this.createModel(item, modelBase);
            }
            if (!this.mapping[model.getId()]) {
                this.data.push(model);
                this.onAdd(model);
            }
            items.push(model);
        });
        this.applySorters();
        this.nestedUpdate();
        return items;
    }

    indexOf(model) {
        return this.data.indexOf(model);
    }

    indexOfId(id) {
        let model = this.getById(id);
        return this.data.indexOf(model);
    }

    removeById(id) {
        let model = this.getById(id);
        this.remove(model);
    }

    remove(models) {
        if (!Core.isArray(models)) {
            models = [models];
        }
        models.forEach((item) => {
            this.removed.push(item);
            item.drop();
            Core.Array.remove(this.data, item);
            this.onRemove(item);
        });
        this.applySorters();

        this.nestedUpdate();
    }
    onRemove(model) {
        this.removeModelToRegistry(model);
    }

    removeModelToRegistry(model) {
        delete this.mapping[model.getId()];
    }

    onAdd(model) {
        model.registerCollection(this);
        this.addModelToRegistry(model);
        // this.emit('add', { model });
    }

    addModelToRegistry(model) {
        this.mapping[model.getId()] = model;
    }

    createModel(attributes, modelBase) {
        return new modelBase(attributes);
    }


    filterNewModels() {
        return _.filter(this.data, {
            phantom: true
        });
    }

    filterUpdatedModels() {
        return _.filter(this.data, (i) => {
            return i.dirty && !i.phantom ? true : false
        });
    }

    filterRemoveModels() {
        return _.clone(this.removed);
    }


    needsSync() {
        return this.changed();
    }

    changed() {

        if (this.isSyncing) {
            return false;
        }

        let toCreate = this.getNewModels();
        let toUpdate = this.getUpdatedModels();
        let toDestroy = this.getRemoveModels();

        let needsSync = false;
        if (toCreate.length > 0) {
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            needsSync = true;
        }

        return needsSync;
    }

    async sync(options) {
        if (this.isSyncing) {
            return;
        }
        let toCreate = this.getNewModels();
        let toUpdate = this.getUpdatedModels();
        let toDestroy = this.getRemoveModels();

        let operations = {};
        let needsSync = false;
        if (toCreate.length > 0) {
            operations.create = toCreate;
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            operations.update = toUpdate;
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            operations.destroy = toDestroy;
            needsSync = true;
        }

        if (needsSync) {
            try {
                Vue.set(this, 'isSyncing', true);
                let proxy = this.getOption("proxy");
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

    getNewModels() {
        return this.filterNewModels();
    }

    getUpdatedModels() {
        return this.filterUpdatedModels();
    }

    getRemoveModels() {
        return this.filterRemoveModels();
    }

    getById(key) {
        if (this.mapping[key]) {
            return this.mapping[key];
        }
        return;
    }

    getAt(index) {
        return this.data[index];
    }

    onIdChanged(model, oldId, newId) {
        //borramos el anterior id primero y luego añadimos el nuevo
        //esto para evitar problemas cuando el nuevo y antiguo id son lo mismo;
        delete this.mapping[oldId];
        this.mapping[newId] = model;
    }


    map(fn) {
        return this.data.map(fn);
    }
    each(fn) {
        //copiando orden de elementos actual
        let data = this.data.slice(0);
        for (let x = 0; x < data.length; x++) {
            if (fn(data[x], x) === false) {
                break;
            }
        }
        data.splice(0);//limpiando array
    }


    find(condition) {
        return _.find(this.data, condition);
    }

    applySorters() {
        let propertys = [];
        let directions = [];
        let sorters = this.sorters || this.getOption("sorters") || [];
        for (let x = 0; x < this.sorters.length; x++) {
            let item = sorters[x];
            propertys.push(item.fn || item.property);
            directions.push(item.direction ? item.direction.toLowerCase() : "asc");
        }
        let data = _.orderBy(this.data, propertys, directions);
        Vue.set(this, 'data', data);
    }

    onDataChanged() {

        this.applySorters();


        this.nestedUpdate();
    }

    nestedUpdate() {

        if (this.getOption("modelParent")) {
            let modelParent = this.getOption("modelParent");
            modelParent.onDirtyChildStore(this);
        }
    }

    updateParent() {
        this.nestedUpdate();
    }

    cancelChanges() {
        // this.data.forEach((model) => {
        //     model.cancelChanges();
        // });

        this.each((record) => {
            record.cancelChanges();
        });
        //copiamos los records removidos para restaurarlos
        let removeRecords = this.removed.slice(0);

        //obtenemos los nuevos modelos para eliminarlos
        let newModels = this.getNewModels();

        //eliminamos los records
        this.remove(newModels);

        //limpiamos los records eliminados
        for (let x = 0; x < newModels.length; x++) {
            newModels[x].commit();
            Core.Array.remove(this.removed, newModels[x]);
        }

        //volvemos añadir los records que se habian eliminado
        this.add(removeRecords);

    }

    moveTo(model, index, fn) {
        let oldIndex = this.data.indexOf(model);
        if (oldIndex > -1) {
            const targetRow = this.data.splice(oldIndex, 1)[0];
            this.data.splice(index, 0, targetRow);
            this.each(fn);
        }
    }


    commitRemove(models) {
        if (!models) {
            models = this.filterRemoveModels();
        }
        if (!Core.isArray(models)) {
            models = [models];
        }
        for (let x = 0; x < models.length; x++) {
            models[x].commit();
            Core.Array.remove(this.removed, models[x]);
        }
    }
}
export default Store;