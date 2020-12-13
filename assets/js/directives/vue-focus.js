const Vue = require('vue');

Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  },
  update: function (el) {
    Vue.nextTick(function() {
      el.focus();
    });
  }
});