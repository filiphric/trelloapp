const Vue = require('vue');
const Login = require('./login');

Vue.component('Navbar', {
  components: {
    'Login': Login
  },
  template: '#navbar',
  data: function() {
    return {
      loginDropdown: false
    };
  },
  methods: {
    openLogin: function() {
      this.$root.showLoginModule = true;
    },
    logout: function () {
      this.$root.loggedIn.active = false;
      // axios.defaults.headers.common['Authorization'] = '';
      document.cookie = 'trello_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.location.href = '/';
    },
  }
});