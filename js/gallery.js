'use strict';

(function () {
  var imagesList = document.querySelector('.pictures');
  var imagesArray = window.data.generateArray(window.data.IMAGES_NUMBER);
  var fragment = window.picture.renderImagesList(imagesArray);
  imagesList.appendChild(fragment);
})();
