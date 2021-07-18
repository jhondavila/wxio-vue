import Vue from "vue";
//import axios http request
import axios from "axios";
// Vue.prototype.$http = axios;
Vue.http = Vue.prototype.$http = axios;
