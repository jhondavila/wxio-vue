import Vue from 'vue';
// import Request from '../../util/Request';
import Request from '../request';

import Core from '../../core';
import ProxyServer from './Server';
class ProxyForm extends ProxyServer {
    async batchChunkMode(operations, store, params) {
        if (operations.create) {
            await this.chunkCUD(store, operations.create, "create", params);
        }


        if (operations.update) {
            await this.chunkCUD(store, operations.update, "update", params);
        }


        if (operations.destroy) {
            await this.chunkCUD(store, operations.destroy, "destroy", params);
        }
        console.log("batchChunkMode form")
    }


    async chunkCUD(store, records, operation, params) {

        //Params es añadido al formData
        let pos = 0;
        let size = this.chunkSize;
        let chunkLength = size;
        let config = {
            method: this.method[operation],
            url: this.api[operation],
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
            params.data = data;

            let formData = new FormData();

            for (let p in params) {
                Core.parseToForm(formData, p, params[p]);
            }

            config.data = formData;

            let response = await Request(config);
            this[fnProcess](chunk, response, store);

            pos = chunkLength;
            chunkLength += size;
            chunk = records.slice(pos, chunkLength);
        }


    }


    async batchSimple(operations, store, params) {

        if (operations.create) {
            let data = this.getCreateData(operations.create);
            params.data = data;

            let formData = new FormData();
            for (let p in params) {
                Core.parseToForm(formData, p, params[p]);
            }
            let response = await Request({
                method: this.method["create"],
                url: this.api["create"],
                data: formData
            });
            this.processCreate(operations.create, response, store);
        }

        if (operations.update) {
            let data = this.getUpdateData(operations.update);
            // console.log(data);
            params.data = data;

            let formData = new FormData();
            for (let p in params) {
                Core.parseToForm(formData, p, params[p]);
            }
            let response = await Request({
                method: this.method["update"],
                url: this.api["update"],
                // params: params
                data: formData

            });
            this.processUpdate(operations.update, response, store);
        }

        if (operations.destroy) {
            let data = this.getDestroyData(operations.destroy);
            params.data = data;

            let formData = new FormData();
            for (let p in params) {
                Core.parseToForm(formData, p, params[p]);
            }
            let response = await Request({
                method: this.method["destroy"],
                url: this.api["destroy"],
                data: formData

                // params: params
            });
            this.processDestroy(operations.destroy, response, store);
        }
    }

    async batch(operations, store) {
        let filters = this.parseFilters();
        let extraParams = this.parseExtraParams();
        let params = {};

        Core.apply(params, extraParams);

        if (filters) {
            Core.apply(params, {
                filter: filters
            });
        }


        if (this.chunkSync) {
            await this.batchChunkMode(operations, store, params);
        } else {
            await this.batchSimple(operations, store, params);
        }
        return true;

    }
}

export default ProxyForm;