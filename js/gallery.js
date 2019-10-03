'use strict';

(function () {
  var imagesList = document.querySelector('.pictures');
  var imagesArray = window.data.generateArray(window.data.IMAGES_NUMBER);
  var fragment = window.getPicturesFragment(imagesArray);
  imagesList.appendChild(fragment);
})();
