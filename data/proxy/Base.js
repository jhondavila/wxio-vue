import Vue from 'vue';
// import Request from '../../util/Request';
import Core from '../../core';
class ProxyBase {
  

    constructor(options) {

        this.store = null;

        this.chunkSync = false;
        this.chunkSize = 100;

        Core.apply(this, options);
    }

}

export default ProxyBase;