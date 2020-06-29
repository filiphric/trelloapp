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
	// 		'currentListTargetId': "",
	// 		'currentTaskTargetId': "",
	// 		'inProgressTaskDescription': "",
	// 		'movingList': {},
	// 		'movingListId': "",
	// 		'movingTask': {},
	// 		'movingTaskHasTarget': false,
	// 		'movingTaskId': "",
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
    sortList(evt) {

      console.log(evt);
      

      this.currentBoard.lists.forEach((list, index) => {

        list.order = index

        axios
          .patch(`/api/lists/${list.id}`, { order: index })
        
      });
    },
    sortTask(list, evt) {
      
      // if (evt.removed) {
      //   console.log('removed ' + evt.removed.element.title + ' from ' + evt.removed.element.listId);
      // }
      
      // if (evt.added) {
      //   console.log('added ' + evt.added.element.title + ' to ' + evt.added.element.listId);
      // }

      console.log(evt);

      this.currentLists[list.id].forEach((task, index) => {

        task.order = index

        axios
          .patch(`/api/tasks/${task.id}`, { order: index })
        
      });
      
    },
    justConsole(arg) {
      console.log('hello darkness my old friend ' + arg)
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
		// pickupTask: function(elem) {
		// 	movingListId = elem.id.split('-')[0];
		// 	movingTaskId = elem.id.split('-')[1];
		// 	this.movingTaskId = elem.id;
		// 	this.movingTask = this.lists[movingListId].tasks[movingTaskId];
		// 	this.currentTaskTargetId = elem.id;
		// },
		// pickupList: function(elem) {
		// 	this.movingListId = elem.id;
		// 	this.movingList = this.lists[elem.id];
		// 	this.currentListTargetId = elem.id;
		// },
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
          this.currentBoard.tasks.push(taskContent)
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
        })
		},
		cancelNewList() {
			this.newListTitle = "";
			this.newListInputActive = false;
    },
    tasksList: function(list) {
      return this.currentBoard.tasks.filter(b => b.listId === list.id)
    },

		// changeTaskTarget: function(elem) {
		// 	var currentTaskTargetIds = this.currentTaskTargetId.split('-');
		// 	var newTargetIds = elem.id.split('-');
		// 	var currentTarget = {};
		// 	var newTarget = {};
		// 	if (currentTaskTargetIds != newTargetIds) {
		// 		currentTarget.taskId = currentTaskTargetIds[1];
		// 		currentTarget.listId = currentTaskTargetIds[0];
		// 		newTarget.taskId = newTargetIds[1];
		// 		newTarget.listId = newTargetIds[0];

		// 		if (currentTarget.listId == newTarget.listId) {
		// 			this.changeTaskTargetSameList(currentTarget, newTarget);
		// 		} else {
		// 			this.changeTaskTargetDiffList(currentTarget, newTarget);
		// 		}
		// 		this.currentTaskTargetId = elem.id;
		// 	}
		// },
		// changeListTarget: function(elem) {
		// 	var newTargetId = elem.id;
		// 	var currentListTargetId = this.currentListTargetId;
		// 	if (currentListTargetId != newTargetId) {
		// 		this.lists.splice(currentListTargetId, 1);
		// 		this.lists.splice(newTargetId, 0, this.movingList);
		// 		this.currentListTargetId = newTargetId
		// 	}
		// },
		// changeTaskTargetSameList: function(currentTarget, newTarget) {
		// 	this.lists[currentTarget.listId].tasks.splice(currentTarget.taskId, 1);
		// 	this.lists[currentTarget.listId].tasks.splice(newTarget.taskId, 0, this.movingTask);
		// },
		// changeTaskTargetDiffList: function(currentTarget, newTarget) {
		// 	var movingTaskListId = this.movingTaskId.split('-')[0];
		// 	if (currentTarget.listId == movingTaskListId && this.lists[currentTarget.listId].hasPlaceholderTask == false) {
		// 		this.lists[movingTaskListId].hasPlaceholderTask = true;
		// 		this.lists[movingTaskListId].tasks.push({"title":"", "description": "", "placeholder": true});
		// 	}
		// 	if (newTarget.listId == movingTaskListId) {
		// 		this.lists[movingTaskListId].hasPlaceholderTask = false;
		// 		this.lists[movingTaskListId].tasks.pop();
		// 	}
		// 	this.lists[currentTarget.listId].tasks.splice(currentTarget.taskId, 1);
		// 	this.lists[newTarget.listId].tasks.splice(newTarget.taskId, 0, this.movingTask);
		// },
		// placeTaskInTarget: function(elem) {
		// 	var movingTaskListId = this.movingTaskId.split('-')[0];
		// 	var currentTarget = {};
		// 	currentTarget.listId = this.currentTaskTargetId.split('-')[0];
		// 	currentTarget.taskId = this.currentTaskTargetId.split('-')[1];
		// 	if (currentTarget.listId != movingTaskListId) {
		// 		this.lists[movingTaskListId].hasPlaceholderTask = false;
		// 		this.lists[movingTaskListId].tasks.pop();
		// 	}
		// 	this.lists[currentTarget.listId].tasks.$set(currentTarget.taskId, this.movingTask);
		// },
		// placeListInTarget: function(elem) {
		// 	var currentListTargetId = this.currentListTargetId;
		// 	this.lists.$set(currentListTargetId, this.movingList);
		// },
		editTask: function(list, task) {
			this.showTaskModule = true;
			this.currentList = list;
			this.currentTask = task;
			// this.inProgressTaskDescription = this.lists[listId].tasks[taskId].description;
		},
		// cancelNewTask: function(listId) {
		// 	this.lists[listId].addTask = false;
		// },
		saveNewTaskDescription: function(task) {
      this.editTaskDescription = false;
      
      axios
        .patch(`/api/tasks/${task.id}`, {description: task.description})
		}
  },
	computed: {
    
    // newListTitle () {
    //   return this.$store.getters.newListTitle;
    // }
		// currentTask: function() {
		// 	if (this.showTaskModule) {
		// 		return this.lists[this.currentListId].tasks[this.currentTaskId];
		// 	} else {
		// 		return {"title": "", "description": "", "placeholder": false};
		// 	}
		// },
		// currentListTitle: function() {
		// 	if (this.showTaskModule) {
		// 		return this.lists[this.currentListId].title;
		// 	} else {
		// 		return "";
		// 	}
		// },
  },
  watch: {
    // currentBoardName: function() {      
    //   if (!this.loading) {
    //     axios
    //       .patch(`/api/boards/${this.currentBoard.id}`, { name: this.currentBoardName })
    //   }
    // },
    // title: function() {
    //   console.log('hello')
    // }
  }
});