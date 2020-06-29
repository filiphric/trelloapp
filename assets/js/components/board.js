const axios = require('axios');

Vue.component('board', {
	template: '#trello-board',
	data: function() {
		return {
			editTaskDescription: false,
			newListTitle: "",
			newTaskTitle: "",
			currentList: {},
      currentTask: {},
      currentLists: {},
      activeList: null,
      showTaskModule: false,
      currentBoard: {},
      loading: true,
      newListInputActive: false,
      newTaskInputActive: null
		}
  },
  created () {
    axios
      .get(`/api/boards/${this.$route.params.id}`)
      .then(r => r.data)
      .then(board => {   
        this.currentBoard = board 
        this.currentBoardName = board.name;
        this.loading = false
        board.lists.forEach(list => {
          this.$set(this.currentLists, list.id, board.tasks.filter(task => task.listId === list.id))
        });
      })
  },
	methods: {
    sortList() {

      this.currentBoard.lists.forEach((list, index) => {

        list.order = index

        axios
          .patch(`/api/lists/${list.id}`, { order: index })
        
      });
    },
    sortTask(evt) {

      let from = parseInt(evt.from.parentElement.getAttribute('data-id'))
      let to = parseInt(evt.to.parentElement.getAttribute('data-id'))

      this.currentLists[from].forEach((task, index) => {

        task.order = index

        axios
          .patch(`/api/tasks/${task.id}`, { order: index })
        
      });

      if (from !== to) {
  
        this.currentLists[to].forEach((task, index) => {
  
          task.order = index
  
          axios
            .patch(`/api/tasks/${task.id}`, { order: index, listId: to })
          
        });
        
      } 

    },
    updateListName(list) {      
      axios
        .patch(`/api/lists/${list.id}`, { title: list.title })
    },
    updateTaskName(task) {      
      axios
        .patch(`/api/tasks/${task.id}`, { title: task.title })
    },
    updateBoardName() {
      axios
        .patch(`/api/boards/${this.currentBoard.id}`, { name: this.currentBoard.name })
    },
		addTask: function(list) {
      if (!this.newTaskTitle) {
        this.newTaskInputActive = false
        return;
      }
      let task = {
        boardId: this.currentBoard.id,
        description: "",
        listId: list.id,
        title: this.newTaskTitle
      } 
      axios
        .post(`/api/tasks`, task)
        .then(r => r.data)
        .then(taskContent => {    
          this.newTaskTitle = ""
          this.newTaskInputActive = false
          this.currentLists[list.id].push(taskContent)
        })
		},
		addList() {
      if (!this.newListTitle) {
        this.newListInputActive = false
        return;
      }
      let list = {
        boardId: this.currentBoard.id,
        title: this.newListTitle
      } 
      axios
        .post(`/api/lists`, list)
        .then(r => r.data)
        .then(listContent => {    
          this.newListTitle = ""
          this.newListInputActive = false
          this.currentBoard.lists.push(listContent)
          this.currentLists[listContent.id] = []
        })
		},
		cancelNewList() {
			this.newListTitle = "";
			this.newListInputActive = false;
    },
    tasksList: function(list) {
      return this.currentBoard.tasks.filter(b => b.listId === list.id)
    },

		editTask: function(list, task) {
			this.showTaskModule = true;
			this.currentList = list;
			this.currentTask = task;
		},
		saveNewTaskDescription: function(task) {
      this.editTaskDescription = false;
      
      axios
        .patch(`/api/tasks/${task.id}`, {description: task.description})
		}
  }
});