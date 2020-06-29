Vue = require('vue');
VueRouter = require('vue-router');
Vue.use(VueRouter);

require('vuedraggable')
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
  router
}).$mount('#trello-app')
