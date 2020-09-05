const axios = require('axios');
const VueSocketIOExt = require('vue-socket.io-extended');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');
Vue.use(VueSocketIOExt, socket);

Vue.component('board-collection', {
  template: '#trello-board-collection',
  sockets: {
    boardCreated(message) {
      this.boards.push(message);
    },
    boardsState(message) {
      this.boards = message;
    },
    boardDeleted(id) {
      let deleted = this.boards.findIndex( board => board.id === id);
      this.boards.splice(deleted, 1);
    },
    boardUpdate(id, message) {
      let updated = this.boards.findIndex( board => board.id === id);
      let board = this.boards[updated];
      this.$set(this.boards, [updated], { ...board, ...message });
    }
  },
  data: function() {
    return {
      loading: true,
      boards: [],
      newBoardTitle: '',
      newBoardInputActive: false
    };},
  created () {
    axios
      .get('/api/boards')
      .then(r => r.data)
      .then(boards => {
        this.loading = false;
        this.boards = boards;
      });
  },
  methods: {
    createNewBoard () {
      if (!this.newBoardTitle) {
        return;
      }
      axios.post('/api/boards', { name: this.newBoardTitle }).then((r) => {
        this.boards.push(r.data);
        this.$router.push(`/board/${r.data.id}`);
      }).catch( () => {
        this.$root.errorMessage.show = true;
        this.$root.errorMessage.text = 'There was an error creating board';
        setTimeout(() => {
          this.$root.errorMessage.show = false;
        }, 4000);
      });
      this.newBoardTitle = '';
    },
    toggleNewBoardInput: function(flag) {
      this.newBoardInputActive = flag;
    },
    updateBoardStarred: function(board) {
      let flag = !board.starred;
      axios.patch(`/api/boards/${board.id}`, {starred: flag});
      this.boards.find(b => b.id === board.id).starred = flag;
    },
    starred: function(boards) {
      let starredBoards = boards.filter(b => b.starred === true);
      return starredBoards;
    }
  }
});