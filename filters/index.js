import * as Basic from './Basic' // global filters
import Vue from 'vue'
// register global utility filters.
Object.keys(Basic).forEach(key => {
    Vue.filter(key, Basic[key])
})