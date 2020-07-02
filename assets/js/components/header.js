Vue.component('nav-header', {
  template: '#trello-nav-header',
  data: function() {
    return {
      showLoginModule: false
    }},
  methods: {
    gotoLogin: function() {
			this.showLoginModule = true;
		}
  }
  })