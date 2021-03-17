const Vue = require('vue');
const axios = require('axios');

Vue.component('Login', {
  template: '#login',
  data: function() {
    return {
      signupCardActive: false,
      loginEmail: '',
      loginPassword: '',
      signupEmail: '',
      signupPassword: '',
      sendEmails: false,
      loginDropdown: false,
      loginCardActive: true,
    };
  },
  created () {
    let parsedCookies = document.cookie.split('; ').reduce((prev, current) => {
      const [name, value] = current.split('=');
      prev[name] = value;
      return prev;
    }, {});

    if (parsedCookies['trello_token']) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedCookies['trello_token']}`;

      axios
        .get('/api/users').then( r => {
          this.$root.loggedIn.active = true;
          this.$root.loggedIn.email = r.data.user.email;
        }).catch( () => {
          document.cookie = 'trello_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        });

    }
  },
  methods: {
    closeLogin: function() {
      this.$root.showLoginModule = false;
      this.loginEmail = '';
      this.loginPassword = '';
      this.signupEmail = '';
      this.signupPassword = '';
    },
    logSignSwitch: function() {
      this.signupCardActive = !this.signupCardActive;
      this.loginCardActive = !this.loginCardActive;
    },
    login: function () {
      axios
        .post('/login', {
          email: this.loginEmail,
          password: this.loginPassword
        })
        .then( r => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.accessToken}`;
          document.cookie = `trello_token=${r.data.accessToken}`;
          this.$root.loggedIn.email = this.loginEmail;
          this.$root.showLoginModule = false;
          this.loginCardActive = false;
          this.signupCardActive = false;
          this.$router.go();
        })
        .catch( r => {
          console.log(r.data);
        });
    },
    signup: function () {
      axios({
        method: 'POST',
        url: '/signup',
        data: {
          email: this.signupEmail,
          password: this.signupPassword
        }
      })
        .then( r => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.accessToken}`;
          document.cookie = `trello_token=${r.data.accessToken}`;
          if (this.sendEmails) {
            axios
              .post('/welcomeemail', {
                email: this.signupEmail
              }).then(() => {
                this.$router.go();
              });
          } else {

            this.$router.go();

          }

          this.$root.loggedIn.email = this.signupEmail;
          this.$root.showLoginModule = false;
          this.loginCardActive = false;
          this.signupCardActive = false;

        })
        .catch( r => {
          console.log(r.data);
        });
    }
  }
});