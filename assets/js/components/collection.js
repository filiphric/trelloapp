const axios = require('axios');

Vue.component('board-collection', {
    template: '#trello-board-collection',
    data: function() {
      return {
        loading: true,
        boards: [],
        newBoardTitle: "",
        newBoardInputActive: false
      }},
    created () {
      axios
        .get('/api/boards')
        .then(r => r.data)
        .then(boards => {          
          this.loading = false;
          this.boards = boards;
        })
    },
    methods: {
    	createNewBoard () {
        if (!this.newBoardTitle) {
          return;
        }
        axios.post('/api/boards', { name: this.newBoardTitle }).then((r) => {  
          this.boards.push(r.data);
          this.$router.push(`/board/${r.data.id}`)
        })
        this.newBoardTitle = ''
    	},
    	toggleNewBoardInput: function(flag) {
          this.newBoardInputActive = flag
    	},
    	updateBoardStarred: function(board) {
        let flag = !board.starred
        axios.patch(`/api/boards/${board.id}`, {starred: flag});        
        this.boards.find(b => b.id === board.id).starred = flag;
      },
      starred: function(boards) {
        let starredBoards = boards.filter(b => b.starred === true)
    		return starredBoards
    	}
    }
});