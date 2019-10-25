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

  var imagesData;

  var clearImagesList = function () {
    var images = document.querySelectorAll('.picture');
    images.forEach(function (element) {
      element.remove();
    });
  };

  var lastTimeout;

  var createImagesList = function (imagesArray) {
    clearImagesList();
    var imagesList = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();


    for (var i = 0; i < imagesArray.length; i++) {
      fragment.appendChild(renderImage(imagesArray[i]));
    }
    imagesList.appendChild(fragment);
  };

  var successHandler = function (imagesArray) {
    imagesData = imagesArray;
    createImagesList(imagesData);
    imageFilters.classList.remove('img-filters--inactive');
  };

  var errorHandler = function (errorMessage) {
    var errorBlock = errorTemplate.cloneNode(true);

    errorBlock.querySelector('.error__title').textContent = errorMessage;
    mainSection.insertAdjacentElement('afterbegin', errorBlock);
  };

  var onPopularFilter = function () {
    popularFilter.classList.add('img-filters__button--active');
    randomFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      createImagesList(imagesData);
    }, 500);
    document.removeEventListener('click', onPopularFilter);
  };

  var onDiscussedFilter = function () {
    discussedFilter.classList.add('img-filters__button--active');
    popularFilter.classList.remove('img-filters__button--active');
    randomFilter.classList.remove('img-filters__button--active');

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      var discussedArray = [];
      discussedArray = imagesData.slice();
      discussedArray.sort(function (a, b) {
        return b.likes - a.likes;
      });
      createImagesList(discussedArray);
    }, 500);

    document.removeEventListener('click', onDiscussedFilter);
  };

  var onRandomFilter = function () {
    popularFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');
    randomFilter.classList.add('img-filters__button--active');

    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      var randomArray = [];
      var getRandomFromArray = function (array) {
        return array[Math.floor(Math.random() * array.length)];
      };

      do {
        var newImage = getRandomFromArray(imagesData);
        if (!randomArray.includes(newImage)) {
          randomArray.push(newImage);
        }
      } while (randomArray.length < 10);

      createImagesList(randomArray);
    }, 500);

    // randomFilter.removeEventListener('click', onRandomFilter);
    document.removeEventListener('click', onRandomFilter);
  };

  randomFilter.addEventListener('click', onRandomFilter);
  popularFilter.addEventListener('click', onPopularFilter);
  discussedFilter.addEventListener('click', onDiscussedFilter);

  window.load(successHandler, errorHandler);
})();
