

export default {
  storeErrorLog(Vue, store) {
    Vue.config.errorHandler = function (err, vm, info, a) {
      Vue.nextTick(() => {
        store.dispatch('addErrorLog', {
          err,
          vm,
          info,
          url: window.location.href
        })
      })
    }
  }
};