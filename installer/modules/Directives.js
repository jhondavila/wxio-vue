import Vue from "vue";
import longpressed from "../../directive/LongPressed";
import HoldPressed from "../../directive/HoldPressed";
import waves from "../../directive/waves";
import focus from "../../directive/Focus";
Vue.use(longpressed, { duration: 1000 });
Vue.use(HoldPressed);
Vue.use(waves);
Vue.use(focus);