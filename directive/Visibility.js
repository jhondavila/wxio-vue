exports.install = function (Vue, options) {
    
    Vue.directive('visible', function (el, binding) {
        el.style.visibility = !!binding.value ? 'visible' : 'hidden';
    });


}