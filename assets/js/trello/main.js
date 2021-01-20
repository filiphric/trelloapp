const axios = require('axios');

const Vue = require('vue');
const VueRouter = require('vue-router');
Vue.use(VueRouter);
Vue.use(require('vue-shortkey'));

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
});

const app = new Vue({
  data: function() {
    return {
      errorMessage: {
        show: false,
        text: 'Oops, there was an error'
      },
      loggedIn: {
        active: false,
        email: '',
      },
      showLoginModule: false,
      tools: false
    };
  },
  methods: {
    resetAll: function() {
      axios
        .post('/api/reset');
    },
    resetBoards: function() {
      axios
        .delete('/api/boards');
    },
    resetLists: function() {
      axios
        .delete('/api/lists');
    },
    resetTasks: function() {
      axios
        .delete('/api/tasks');
    },
    resetUsers: function() {
      axios
        .delete('/api/users');
    },
    toggleTools: function() {
      this.tools = !this.tools;
    },
  },
  router
}).$mount('#trello-app');

window.app = app;