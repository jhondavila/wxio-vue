import Vue from 'vue';
import Request from '../request';
import Core from '../../core';
import Base from './Base';
import * as _ from "lodash"
class ProxyServer extends Base {

    constructor(options) {
        super(options);
        this.mode = "single";
        this.api = {
            destroy: null,
            read: null,
            update: null,
            create: null
        };
        this.method = {
            destroy: "DELETE",
            read: "GET",
            update: "PUT",
            create: "POST"
        };
        Core.apply(this, options);
    }


    parseFilters() {
        let filter;
        let list = [];
        let filters = this.store ? this.store.filters : [];
        for (let x = 0; x < filters.length; x++) {
            if (filters[x]) {
                filter = {};
                Core.apply(filter, filters[x]);
                list.push(filter);
            }
        }
        if (list.length > 0) {
            return list;
        } else {
            return;
        }
    }

    async load(options) {
        options = options || {};
        let filters = this.parseFilters();
        let params = {
            start: options.start,
            limit: options.limit
        };
        let extraParams = this.parseExtraParams();

        Core.apply(params, extraParams);
        if (filters) {
            Core.apply(params, {
                filter: Core.JSON.encode(filters),
            });
        }

        let response = await Request({
            method: this.method["read"],
            url: this.api["read"],
            params: params
        });
        return response;
    }

    parseExtraParams() {
        return this.store ? this.store.extraParams || {} : {};
    }

    async batchSimple(operations, store, params) {
        // debugger
        if (operations.create) {
            let data = this.getCreateData(operations.create, store);
            // console.log(data);
            params.data = Core.JSON.encode(data);
            let response = await Request({
                method: this.method["create"],
                url: this.api["create"],
                params: params
            });
            this.processCreate(operations.create, response, store);
        }


        if (operations.update) {
            let data = this.getUpdateData(operations.update, store);
            params.data = Core.JSON.encode(data);
            let response = await Request({
                method: this.method["update"],
                url: this.api["update"],
                params: params
            });
            this.processUpdate(operations.update, response, store);
        }

        await this.getNestedSync(operations.create);
        await this.getNestedSync(operations.update);

        if (operations.destroy) {
            let data = this.getDestroyData(operations.destroy, store);
            params.data = Core.JSON.encode(data);

            let response = await Request({
                method: this.method["destroy"],
                url: this.api["destroy"],
                params: params
            });
            this.processDestroy(operations.destroy, response, store);
        }

    }

    async getNestedSync(records) {
        let stores = [];
        _.each(records, (record) => {
            record._eachNestedTypes((field, value) => {
                if (value) {
                    stores.push(value);
                }
            });
        });
        for (let x = 0; x < stores.length; x++) {
            // let status = stores[x].needsSync();
            // console.log(status);
            await stores[x].sync();
        }
    }
    async batchChunkMode(operations, store, params) {

        // console.log("batchChunkMode");


        if (operations.create) {
            await this.chunkCUD(store, operations.create, "create", params);
        }


        if (operations.update) {
            await this.chunkCUD(store, operations.update, "update", params);
        }


        if (operations.destroy) {
            await this.chunkCUD(store, operations.destroy, "destroy", params);
        }


    }

    async chunkCUD(store, records, operation, params) {
        //Parama se añade al config, ya que el envio es por URL

        let pos = 0;
        let size = this.chunkSize;
        let chunkLength = size;
        let config = {
            method: this.method[operation],
            url: this.api[operation],
            params: params
        };
        let fnProcess;
        let fnGetData;
        if (operation === "create") {
            fnProcess = "processCreate";
            fnGetData = "getCreateData";
        } else if (operation === "update") {
            fnProcess = "processUpdate";
            fnGetData = "getUpdateData";
        } else if (operation === "destroy") {
            fnProcess = "processDestroy";
            fnGetData = "getDestroyData";
        }

        let chunk = records.slice(pos, chunkLength);

        while (chunk.length > 0) {
            let data = this[fnGetData](chunk);
            config.params.data = Core.JSON.encode(data);

            let response = await Request(config);
            this[fnProcess](chunk, response, store);

            pos = chunkLength;
            chunkLength += size;
            chunk = records.slice(pos, chunkLength);
        }


    }



    async batch(operations, store) {
        let filters = this.parseFilters();
        let extraParams = this.parseExtraParams();
        let params = {};

        Core.apply(params, extraParams);

        if (filters) {
            Core.apply(params, {
                filter: Core.JSON.encode(filters)
            });
        }

        if (this.chunkSync) {
            await this.batchChunkMode(operations, store, params);
        } else {
            await this.batchSimple(operations, store, params);
        }
        return true;
    }



    getCreateData(records, store) {
        // debugger
        return _.map(records, _.method('getData', {
            serialize: true,
            persist: true,
            nested: this.mode === "batch" ? false : true,
            foreignKey: store ? store.getOption("foreignKey") : null,
            modelParent: store ? store.getOption("modelParent") : null
        }));
    }

    getUpdateData(records, store) {

        return _.map(records, _.method('getData', {
            serialize: true,
            changes: true,
            persist: true,
            nested: this.mode === "batch" ? false : true,
            foreignKey: store ? store.getOption("foreignKey") : null,
            modelParent: store ? store.getOption("modelParent") : null
        }));
    }

    getDestroyData(records, store) {
        return _.map(records, (i) => {
            let obj = {};

            obj[i.idProperty] = i.getId();
            return obj;
        });
    }

    processCreate(records, response, store) {
        let rs = response.data;
        let data = rs.data;
        // if (data && data.success !== false) {
        if (!rs) {
            return;
        }
        if (rs.success === false) {
            return;
        }
        if (data) {
            let model = records[0];
            if (model) {
                this.applyRemoteData(model, records, data, store);
            }
        }
        for (let x = 0; x < records.length; x++) {
            records[x].commit(undefined, undefined, this.mode === "single" ? false : true);
        }

    }



    applyRemoteData(model, records, data, store) {
        console.log("applyRemoteData")
        let clientId = model.clientIdProperty;
        let idProperty = model.idProperty;

        let i, p;
        for (let x = 0; x < data.length; x++) {
            i = data[x];
            let rec = store.getById(i[clientId]);
            if (rec) {
                rec.set(idProperty, i[idProperty]);
                for (p in i) {
                    rec.set(p, i[p]);
                }
            } else {
                console.log("record no encontrado clientId: " + i[clientId]);
            }
        }

    }

    applyRemoteDataUpdated(model, records, data, store) {

        // let clientId = model.clientIdProperty;
        let idProperty = model.idProperty;

        let i, p;
        for (let x = 0; x < data.length; x++) {
            i = data[x];
            let rec = store.getById(i[idProperty]);
            if (rec) {
                for (p in i) {
                    rec.set(p, i[p]);
                }
            } else {
                console.log("record no encontrado clientId: " + i[clientId]);
            }
        }
    }

    processUpdate(records, response, store) {
        let rs = response.data;
        let data = rs.data;
        if (!rs) {
            return;
        }
        if (rs.success === false) {
            return;
        }
        if (data) {
            let model = records[0];
            if (model) {
                this.applyRemoteDataUpdated(model, records, data, store);
            }
        }


        for (let x = 0; x < records.length; x++) {
            records[x].commit(undefined, undefined, this.mode === "single" ? false : true);
        }
    }

    processDestroy(records, response, store) {
        let rs = response.data;
        let data = rs.data;
        if (!rs) {
            return;
        }
        if (rs.success === false) {
            return;
        }
        if (data) {

        }

        for (let x = 0; x < records.length; x++) {
            records[x].commit();
            Core.Array.remove(store.removed, records[x]);
        }

    }
}

export default ProxyServer;