'use strict';

(function () {

  var COMMENTS_NUMBER = 5;
  var LIKES_MIN = 15;
  var LIKES_MAX = 200;

  window.data = {
    ESC_CODE: 27,
    ENTER_CODE: 13,
    IMAGES_NUMBER: 25,
    generateArray: function (j) {
      var dataArray = [];

      for (var i = 0; i < j; i++) {
        dataArray.push({
          url: 'photos/' + getRandomArbitrary(1, j) + '.jpg',
          description: '',
          likes: getRandomArbitrary(LIKES_MIN, LIKES_MAX),
          comments: generateComments()
        });
      }

      return dataArray;
    }
  };

})();
