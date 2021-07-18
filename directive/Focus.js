exports.install = function (Vue, options) {
    Vue.directive('focus', {
        inserted: function (el) {
            let input = el.querySelector("input");
            if (input) {
                input.focus();
            } else {
                el.focus();
            }
        }
    });
}
