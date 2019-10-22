'use strict';

(function () {
  var mainSection = document.querySelector('main');

  var imagesTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

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

  var imagesList = document.querySelector('.pictures');

  var successHandler = function (imagesArray) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < imagesArray.length; i++) {
      fragment.appendChild(renderImage(imagesArray[i]));
    }
    imagesList.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    var errorBlock = errorTemplate.cloneNode(true);

    errorBlock.querySelector('.error__title').textContent = errorMessage;
    mainSection.insertAdjacentElement('afterbegin', errorBlock);
  };

  window.load(successHandler, errorHandler);
})();
