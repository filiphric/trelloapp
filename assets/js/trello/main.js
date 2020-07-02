Vue = require('vue');
VueRouter = require('vue-router');
Vue.use(VueRouter);

require('vuedraggable');
require('./../directives/vue-focus.js');
require('./../components/collection.js');
require('./../components/board.js');

var router = new VueRouter({
  mode: 'history',
  base: window.location.pathName,
  routes: [
    { path: '*', redirect: '/' },
    { path: '/', name: 'board-collection', component: Vue.component('board-collection') },
    { path: '/board/:id', name: 'board', component: Vue.component('board') },
  ]
})

new Vue({
  data: function() {
		return {
      showLoginModule: false,
      loginCardActive: false,
      signupCardActive: false
    }
  },
  methods: {
    openLogin: function() {
			this.showLoginModule = true;
			this.loginCardActive = true;
    },
    closeLogin: function() {
			this.showLoginModule = false;
			this.loginCardActive = false;
			this.signupCardActive = false;
    },
    logSignSwitch: function() {
			this.signupCardActive = !this.signupCardActive;
			this.loginCardActive = !this.loginCardActive;
    }
  },
  router
}).$mount('#trello-app')
