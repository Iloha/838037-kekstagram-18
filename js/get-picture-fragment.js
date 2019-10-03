'use strict';

(function () {
  var imagesTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  window.getPicturesFragment = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderImage(array[i]));
    }

    return fragment;
  };

  var onEnterPressPicture = function (evt, picture) {
    if (evt.keyCode === window.data.ENTER_CODE) {
      window.showBigPicture(picture);
    }
  };

  var onClickPictureShow = function (picture) {
    window.showBigPicture(picture);
  };

  var renderImage = function (image) {
    var imageElement = imagesTemplate.cloneNode(true);

    imageElement.querySelector('.picture__img').src = image.url;
    imageElement.querySelector('.picture__likes').textContent = image.likes;
    imageElement.querySelector('.picture__comments').textContent = image.comments.length;
    imageElement.addEventListener('click', function () {
      onClickPictureShow(image);
    });
    imageElement.addEventListener('keydown', function () {
      onEnterPressPicture(image);
    });

    return imageElement;
  };

})();
