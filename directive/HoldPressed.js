exports.install = function (Vue, options) {
  if (!options) options = {}
  if (!options.duration) options.duration = 100

  Vue.directive('hold-press', {
    bind: function (el, binding) {
      var self = this

      this._timeout = null
      this._onmouseup = function () {
        clearInterval(self._timeout)
      }

      this._onmousedown = function (e) {
        var context = this

        self._timeout = setInterval(function () {
          binding.value.call(context, e)
        }, options.duration)
      }
      el.addEventListener('mousedown', this._onmousedown)
      el.addEventListener('touchstart', this._onmousedown)
      el.addEventListener('mouseup', this._onmouseup)
      el.addEventListener('touchend', this._onmouseup)
    },
    unbind: function (el) {
      clearInterval(this._timeout)
      el.removeEventListener('mousedown', this._onmousedown)
      el.removeEventListener('touchstart', this._onmousedown)
      el.removeEventListener('mouseup', this._onmouseup)
      el.removeEventListener('touchend', this._onmouseup)
    }
  })
}