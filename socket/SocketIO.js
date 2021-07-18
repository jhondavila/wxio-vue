import io from 'socket.io-client'
// import Wx from 'Wx'
// import { EventEmitter } from 'events'
// import { EventEmitter } from 'events';
import Core from "../core/index";
class SocketTicket {
    //config
    url = null;
    nameSpace = "/";
    autoConnect = false;
    multiplex = false;
    params = {};
    reconnectionDelay = 1000;
    reconnectionDelayMax = 5000;
    reconnectionAttempts = Infinity;


    //properties
    urlSpace = null;

    constructor(config) {
        Object.assign(this, config);
        this.urlSpace = Core.urlJoin(this.url, this.nameSpace);
        this.cnx = io.connect(this.urlSpace, this.getInitialConfig());
    }
    getInitialConfig() {
        return {
            multiplex: this.multiplex,
            autoConnect: this.autoConnect,
            reconnectionDelay: this.reconnectionDelay,
            reconnectionDelayMax: this.reconnectionDelayMax,
            reconnectionAttempts: this.reconnectionAttempts,
            query: this.params
        };
    }
    setParams(params) {
        Object.assign(this.cnx.query, params);
        // Wx.apply(this.cnx.query, params);
    }
    connect() {
        if (this.cnx.connected) {
            return this;
        }
        this.urlSpace = Core.urlJoin(this.url, this.nameSpace);
        this.cnx.io.uri = this.urlSpace;
        this.cnx.connect();
        return this;
    }
    disconnect() {
        this.cnx.disconnect();
    }
    emit() {
        this.cnx.emit.apply(this.cnx, arguments);
    }
    on() {
        this.cnx.on.apply(this.cnx, arguments);
    }
    isConnect() {
        return (this.cnx) ? this.cnx.connected : false;
    }
    reconnect() {
        this.cnx.reconnect();
    }
}

export default SocketTicket;