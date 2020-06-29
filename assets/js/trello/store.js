(function (exports) {

  const axios = require('axios');

	// var BOARD_STORAGE_KEY = 'trello-boards';
	// localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(data['boards']));
	// var BOARD_COUNT_KEY = 'trello-board-count';
	// var boardCount = 0;
	// for (board in data['boards']) {
	// 	boardCount += 1;
	// }
	// localStorage.setItem(BOARD_COUNT_KEY, JSON.stringify(boardCount));

	exports.trelloStorage = {
		fetchBoardCollection: function () {
      // axios
      //   .get('/boards')
      //   .then(r => r.data)
      //   .then(response => (this.boards = response))
      // axios
      //   .get('/boards')
      //   .then(r => r.data)
      //   .then(boards => {
      //     console.log(boards);
      //     return boards;
      //   })
      // return data['boards'];
			// return JSON.parse(localStorage.getItem(BOARD_STORAGE_KEY) || '[]');
		},
		saveBoardCollection: function (boards) {
			// localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boards));
		},
		fetchBoard: function (boardId) {
			return this.fetchBoardCollection()[boardId];
		},
		saveBoard: function(boardId, lists) {
			var updatedCollection = this.fetchBoardCollection();
			updatedCollection[boardId]['lists'] = lists;
			this.saveBoardCollection(updatedCollection);
		},
		fetchBoardCount: function() {
			// return JSON.parse(localStorage.getItem(BOARD_COUNT_KEY) || '[]');
		},
		saveBoardCount: function(boardCount) {
			// localStorage.setItem(BOARD_COUNT_KEY, JSON.stringify(boardCount));
		}
	};

})(window);