const moment = require('moment');
const axios = require('axios');
const vueDropzone = require('vue2-dropzone');
Vue.component('board', {
  template: '#trello-board',
  components: {
    vueDropzone
  },
  data: function() {
    return {
      editTaskDescription: false,
      newListTitle: '',
      newTaskTitle: '',
      currentList: {},
      currentTask: {},
      currentLists: {},
      showTaskModule: false,
      taskDropdown: false,
      listDropdown: false,
      boardDropdown: false,
      currentBoard: {},
      loading: true,
      newListInputActive: false,
      newTaskInputActive: null,
      dropzoneOptions: {
        url: 'http://localhost:3000/api/upload',
        thumbnailWidth: 150,
        maxFilesize: 12
      }
    };
  },
  created () {
    axios
      .get(`/api/boards/${this.$route.params.id}`)
      .then(r => r.data)
      .then(board => {   
        this.currentBoard = board; 
        this.currentBoardName = board.name;
        this.loading = false;
        board.lists.forEach(list => {
          this.$set(this.currentLists, list.id, board.tasks.filter(task => task.listId === list.id));
        });
      });
  },
  methods: {
    fileUploaded(res) {

      let path = JSON.parse(res.xhr.response).path;
      
      axios
        .patch(`/api/tasks/${this.currentTask.id}`, { image: path });

      this.$set(this.currentTask, 'image', path);

    },
    addImageId(file, xhr){
      xhr.setRequestHeader('taskId', this.currentTask.id);
    },
    removeImage() {

      axios
        .patch(`/api/tasks/${this.currentTask.id}`, { image: null });

      this.currentTask.image = null;

    },
    sortList() {

      this.currentBoard.lists.forEach((list, index) => {

        list.order = index;

        axios
          .patch(`/api/lists/${list.id}`, { order: index });
        
      });
    },
    sortTask(evt) {

      let from = parseInt(evt.from.parentElement.getAttribute('data-id'));
      let to = parseInt(evt.to.parentElement.getAttribute('data-id'));

      // get old position + new position and use it with slice
      // changing 0 and 1 - just change slice (0, 1)
      // changing 2 and 4 - just change slice (2, 4)
      // ordering backwards - revert slice order
      // how to get indexes numbers?

      this.currentLists[from].forEach((task, index) => {

        // change index in data store
        task.order = index;

        axios
          .patch(`/api/tasks/${task.id}`, { order: index });
        
      });

      // get old list and do a full reorder
      // get new list and new position, order everything from slice start to slice down

      if (from !== to) {
  
        this.currentLists[to].forEach((task, index) => {
  
          // change index in data store - keep this for full reorder of old list, but use currentLists[from]
          task.order = index;
  
          // send request to api
          axios
            .patch(`/api/tasks/${task.id}`, { order: index, listId: to });
          
        });
        
      } 

    },
    updateListName(list) {      
      axios
        .patch(`/api/lists/${list.id}`, { title: list.title });
    },
    updateTaskName(task) {      
      axios
        .patch(`/api/tasks/${task.id}`, { title: task.title });
    },
    updateBoardName() {
      axios
        .patch(`/api/boards/${this.currentBoard.id}`, { name: this.currentBoard.name });
    },
    addTask: function(list) {
      if (!this.newTaskTitle) {
        this.newTaskInputActive = false;
        return;
      }
      let task = {
        boardId: this.currentBoard.id,
        description: '',
        completed: false,
        listId: list.id,
        title: this.newTaskTitle
      }; 
      axios
        .post('/api/tasks', task)
        .then(taskContent => {    
          this.newTaskTitle = '';
          this.newTaskInputActive = false;
          this.currentLists[list.id].push(taskContent.data);
        }).catch( () => {
          this.$root.errorMessage.show = true;
          this.$root.errorMessage.text = 'There was an error creating task';
          setTimeout(() => {
            this.$root.errorMessage.show = false;
          }, 4000);
        });
    },
    addList() {
      if (!this.newListTitle) {
        this.newListInputActive = false;
        return;
      }
      let list = {
        boardId: this.currentBoard.id,
        title: this.newListTitle
      }; 
      axios
        .post('/api/lists', list)
        .then(listContent => {    
          this.newListTitle = '';
          this.newListInputActive = false;
          this.currentBoard.lists.push(listContent.data);
          this.currentLists[listContent.data.id] = [];
        }).catch( () => {
          this.$root.errorMessage.show = true;
          this.$root.errorMessage.text = 'There was an error creating list';
          setTimeout(() => {
            this.$root.errorMessage.show = false;
          }, 4000);
        });
    },
    cancelNewList() {
      this.newListTitle = '';
      this.newListInputActive = false;
    },
    tasksList: function(list) {
      return this.currentBoard.tasks.filter(b => b.listId === list.id);
    },
    editTask: function(list, task) {
      this.showTaskModule = true;
      this.currentList = list;
      this.currentTask = task;
      // this.$set(this.currentTask, 'id', task.id)
    },
    completeTask: function(task) {
      axios
        .patch(`/api/tasks/${task.id}`, {completed: task.completed});
    },
    deleteTask: function(task) {
      this.showTaskModule = false;
      this.currentTask = {};
      this.currentLists[task.listId] = this.currentLists[task.listId].filter(t => { return t.id !== task.id; });
      
      axios
        .delete(`/api/tasks/${task.id}`);
    },
    deleteList: function(list) {
      this.currentBoard.lists = this.currentBoard.lists.filter(l => { return l.id !== list.id; });
      axios
        .delete(`/api/lists/${list.id}`);
    },
    deleteBoard: function(deleteBoard) {
            
      axios
        .delete(`/api/boards/${deleteBoard.id}`)
        .then( () => {
          this.$router.push('/');
        });
    },
    saveNewTaskDescription: function(task) {
      this.editTaskDescription = false;
      axios
        .patch(`/api/tasks/${task.id}`, {description: task.description});
    },
    saveNewTaskDeadline: function(task) {
      axios
        .patch(`/api/tasks/${task.id}`, {deadline: task.deadline});
    },
    overdue: function(task) {
      if (task.deadline && moment(task.deadline).diff(moment().startOf('day'), 'days') < 1) {
        return 'overDue';
      } 
    }
  }
});