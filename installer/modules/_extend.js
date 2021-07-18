import Vue from "vue";

Vue.prototype.$getClassName = function () {
  return this.$options.name;
};