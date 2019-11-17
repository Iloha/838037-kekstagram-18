'use strict';

(function () {
  var mainSection = document.querySelector('main');
  var imageFilters = document.querySelector('.img-filters');
  var popularFilter = imageFilters.querySelector('#filter-popular');
  var randomFilter = imageFilters.querySelector('#filter-random');
  var discussedFilter = imageFilters.querySelector('#filter-discussed');

  var imagesTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var imagesData;

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

  var clearImagesList = function () {
    var images = document.querySelectorAll('.picture');
    images.forEach(function (element) {
      element.remove();
    });
  };

  var createImagesList = function (imagesArray) {
    clearImagesList();

    var imagesList = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();

    imagesArray.forEach(function (element) {
      fragment.appendChild(renderImage(element));
    });
    imagesList.appendChild(fragment);
  };

  var successHandler = function (images) {
    imagesData = images;
    createImagesList(imagesData);
    imageFilters.classList.remove('img-filters--inactive');
  };

  var errorHandler = function (errorMessage) {
    var errorBlock = errorTemplate.cloneNode(true);

    errorBlock.querySelector('.error__title').textContent = errorMessage;
    mainSection.insertAdjacentElement('afterbegin', errorBlock);
  };

  var getSortedByComments = function (images) {
    var sortedByCommentsArray = [];

    sortedByCommentsArray = images.slice();
    sortedByCommentsArray.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });

    return sortedByCommentsArray;
  };

  var getRandom = function (images) {
    var j;
    var temp;
    var shuffledArray = images.slice();

    for (var i = shuffledArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = shuffledArray[j];
      shuffledArray[j] = shuffledArray[i];
      shuffledArray[i] = temp;
    }

    return shuffledArray.slice(0, 10);
  };

  var onPopularFilterClick = function () {
    popularFilter.classList.add('img-filters__button--active');
    randomFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');

    window.debounce(createImagesList(imagesData));
  };

  var onDiscussedFilterClick = function () {
    discussedFilter.classList.add('img-filters__button--active');
    popularFilter.classList.remove('img-filters__button--active');
    randomFilter.classList.remove('img-filters__button--active');

    var data = getSortedByComments(imagesData);

    window.debounce(createImagesList(data));
  };

  var onRandomFilterClick = function () {
    popularFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');
    randomFilter.classList.add('img-filters__button--active');

    var data = getRandom(imagesData);

    window.debounce(createImagesList(data));
  };

  randomFilter.addEventListener('click', onRandomFilterClick);
  popularFilter.addEventListener('click', onPopularFilterClick);
  discussedFilter.addEventListener('click', onDiscussedFilterClick);

  window.load(successHandler, errorHandler);
})();
