const Vue = require('vue');
const moment = require('moment');
const axios = require('axios');
const vueDropzone = require('vue2-dropzone');
const VueSocketIOExt = require('vue-socket.io-extended');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const _ = require('lodash');
const draggable = require('vuedraggable');
Vue.use(VueSocketIOExt, socket);

Vue.component('board', {
  template: '#trello-board',
  components: {
    vueDropzone,
    draggable
  },
  sockets: {
    listCreated(boardId, message) {
      // check that created list is in current board
      if (this.currentBoard.id === boardId) {
        // add list to board overview data
        this.currentBoard.lists.push(message);
        // add list to current list data
        this.$set(this.currentLists, message.id, []);
      }
    },
    listUpdated(id, message) {
      // find list with ID in board list and update its values
      const updatedData = this.currentBoard.lists.map(x => (x.id === id ? { ...x, ...message } : x));
      this.currentBoard.lists = updatedData;
    },
    listDeleted(id) {
      // update current board overview data
      const updatedItem = this.currentBoard.lists.filter( list => {
        return list.id !== id;
      });
      this.currentBoard.lists = updatedItem;
      // update current lists data
      const updatedList = _.pick(this.currentLists, id);
      this.$set(this.currentLists, updatedList);
    },
    taskCreated(listId, message) {
      // check that created task is in lists of current board
      if (listId in this.currentLists) {
        this.currentLists[listId].push(message);
      }
    },
    taskUpdated(id, message) {
      // find list with ID in board list and update its values
      const updatedData = this.currentLists[message.listId].map(x => (x.id === id ? { ...x, ...message } : x));
      this.currentLists[message.listId] = updatedData;
      this.currentTask = message;
    },
    taskDeleted(id, message) {
      // update current list tasks
      // if (message.listId in this.currentLists) {
      const updatedList = this.currentLists[message.listId].filter( task => {
        return task.id !== id;
      });
      this.currentLists[message.listId] = updatedList;
      // }
    },
    boardUpdate(id, message) {
      this.currentBoard.name = message.name;
    }
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
    copyProperties(content)  {
      const board = JSON.stringify(content, null, 2);
      const clipboard = window.navigator.clipboard;
      /*
        * fallback to older browsers (including Safari)
        * if clipboard API not supported
        */
      if (!clipboard || typeof clipboard.writeText !== 'function') {
        const textarea = document.createElement('textarea');
        textarea.value = board;
        textarea.setAttribute('readonly', true);
        textarea.setAttribute('contenteditable', true);
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const range = document.createRange();
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        textarea.setSelectionRange(0, textarea.value.length);
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return Promise.resolve(true);
      }
      return clipboard.writeText(board);
    },
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
      axios // send api request to create a task
        .post('/api/tasks', task)
        .then(() => {
          this.newTaskTitle = '';
          this.newTaskInputActive = false;
        }).catch( () => { // handle error, show error message
          this.$root.errorMessage.show = true;
          this.$root.errorMessage.text = 'There was an error creating task';
          setTimeout(() => { // hide error message after 4 seconds
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
      axios // send api request to create a list
        .post('/api/lists', list)
        .then(() => {
          this.newListTitle = '';
          this.newListInputActive = false;
        }).catch( () => { // handle error, show error message
          this.$root.errorMessage.show = true;
          this.$root.errorMessage.text = 'There was an error creating list';
          setTimeout(() => { // hide error message after 4 seconds
            this.$root.errorMessage.show = false;
          }, 4000);
        });
    },
    cancelNewList() {
      this.newListTitle = '';
      this.newListInputActive = false;
    },
    // tasksList: function(list) {
    //   return this.currentBoard.tasks.filter(b => b.listId === list.id);
    // },
    editTask: function(list, task) {
      this.showTaskModule = true;
      this.currentList = list;
      this.currentTask = task;
    },
    completeTask: function(task) {
      axios
        .patch(`/api/tasks/${task.id}`, {completed: task.completed});
    },
    closeTask: function() {
      this.currentTask = {};
    },
    deleteTask: function(task) {
      this.showTaskModule = false;
      this.currentTask = {};
      // this.currentLists[task.listId] = this.currentLists[task.listId].filter(t => { return t.id !== task.id; });

      axios
        .delete(`/api/tasks/${task.id}`);
    },
    deleteList: function(list) {
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