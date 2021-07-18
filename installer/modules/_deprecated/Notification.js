import Vue from "vue";

import notification from '../../components/notification';
// Vue.component("wx-notification", notification);
notification.install(Vue, {
    componentName: "wx-notification"
});