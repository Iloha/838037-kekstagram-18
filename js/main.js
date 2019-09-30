'use strict';

var COMMENTS_NUMBER = 6;
var IMAGES_NUMBER = 25;
var AVATAR_MAX = 6;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var ESC_CODE = 27;

var imagesTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var imagesList = document.querySelector('.pictures');

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var namesArray = [
  'Антон',
  'Константин',
  'Роман',
  'Слава',
  'Данил',
  'Андрей',
  'Максим'
];

var getRandomFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomArbitrary = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var generateComments = function () {
  var commentsArray = [];

  for (var i = 0; i < COMMENTS_NUMBER; i++) {
    commentsArray.push({
      avatar: 'img/avatar-' + getRandomArbitrary(1, AVATAR_MAX) + '.svg',
      message: getRandomFromArray(comments),
      name: getRandomFromArray(namesArray)
    });
  }

  return commentsArray;
};

var generateArray = function (j) {
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
};

var renderImage = function (image) {
  var ImageElement = imagesTemplate.cloneNode(true);

  ImageElement.querySelector('.picture__img').setAttribute('src', image.url);
  ImageElement.querySelector('.picture__likes').textContent = image.likes;
  ImageElement.querySelector('.picture__comments').textContent = image.comments.length;

  return ImageElement;
};

var renderImagesList = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderImage(array[i]));
  }

  return fragment;
}

var imagesArray = generateArray(IMAGES_NUMBER);
var fragment = renderImagesList(imagesArray);
imagesList.appendChild(fragment);

// module4-task2
var uploadFile = document.querySelector('#upload-file');
var editFormPopup = document.querySelector('.img-upload__overlay');
var closeEditFormPopup = editFormPopup.querySelector('#upload-cancel');

var sliderPin = editFormPopup.querySelector('.effect-level__pin');
var slider = editFormPopup.querySelector('.effect-level__line');
var sliderWrap = editFormPopup.querySelector('.img-upload__effect-level')
var image = editFormPopup.querySelector('.img-upload__preview img');
var effectPreviewFields = editFormPopup.querySelectorAll('input[name="effect"]');

var editForm = document.querySelector('.img-upload__form');
var tagsListInput = editFormPopup.querySelector('input[name="hashtags"]');
var submitFormButton = editFormPopup.querySelector('.img-upload__submit');
var currentFilter;

var isValid = function () {
  var tagListData = tagsListInput.value.split(' ');
  var uniqueHashtagsList = [];

  if (tagsListInput.value === '') {
    return '';
  }
  if (tagListData.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }
  for (var i = 0; i < tagListData.length; i++) {
    var tag = tagListData[i].toLowerCase();
    if (tag.charAt(0) !== '#' ) {
      return 'Хеш-тег должен начинаться с #';
    }
    if (tag.slice(1).includes('#')) {
      return 'Хэш-теги должны разделяться пробелами';
    }
    if (tag.length === 1) {
      return 'Хеш-тег не может состоять только из #';
    }
    if (tag.length > 20) {
      return 'Максимальная длина хэш-тега должна быть 20 символов';
    }
    if (!uniqueHashtagsList.includes(tag)) {
      uniqueHashtagsList.push(tag);
    }
  }
  if (uniqueHashtagsList.length !== tagListData.length) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }
};

var showEditFormPopup = function () {
  editFormPopup.classList.remove('hidden');
  closeEditFormPopup.addEventListener('click', onCloseForm);
  document.addEventListener('keydown', onPressEscClose);
};

var closeForm = function () {
  editFormPopup.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('click', onCloseForm);
  document.removeEventListener('keydown', onPressEscClose);
};

var submitForm = function () {
  var message = isValid();

  if (message) {
    tagsListInput.setCustomValidity(message);
    return;
  }

  editForm.submit();
};

var setFilter = function (id) {
  image.className = 'effects__preview--' + id;
  currentFilter = id;
};

var setEffectLevel = function (max) {
  var p;
  if (max) {
    p = 1;
  } else {
    p = sliderPin.offsetLeft / slider.offsetWidth;
  }
  var value = '';

  switch (currentFilter) {
    case 'none':
      sliderWrap.classList.add('hidden');
      break;
    case 'chrome':
      value = 'grayscale(' + p + ')';
      break;
    case 'sepia':
      value = 'sepia(' + p + ')';
      break;
    case 'marvin':
      value = 'invert(' + p * 100 + '%)';
      break;
    case 'phobos':
      value = 'blur(' + p * 3 + 'px)';
      break;
    case 'heat':
      value = 'invert(' + p * 3 + ')';
      break;
  }
  image.style.filter = value;
};

var onUploadFileChange = function () {
  showEditFormPopup();
};

var onCloseForm = function () {
  closeForm();
};

var onPressEscClose = function (evt) {
  if (evt.keyCode === ESC_CODE && document.activeElement !== tagsListInput) {
    closeForm();
  }
};

var onMouseUpEffectLevel = function () {
  setEffectLevel();
};

var onEnterPressSubmitForm = function () {
  submitForm();
};

var onChangeEffect = function (evt) {
  var id = evt.target.value;
  setFilter(id);
  setEffectLevel(true);
};

uploadFile.addEventListener('change', onUploadFileChange);
sliderPin.addEventListener('mouseup', onMouseUpEffectLevel);

for (var i = 0; i < effectPreviewFields.length; i++) {
  effectPreviewFields[i].addEventListener('change', onChangeEffect);
}
submitFormButton.addEventListener('click', onEnterPressSubmitForm);

/* task 6 */
var bigPicture = document.querySelector('.big-picture');
var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
var likesCount = bigPicture.querySelector('.likes-count');
var commentsCount = bigPicture.querySelector('.comments-count');
var socialCaption = bigPicture.querySelector('.social__caption');
var comments = bigPicture.querySelector('.social__comments');

var showBigPicture = function () {
  bigPicture.classList.remove('hidden');
};
showBigPicture();

var fillBigPicture = function (picture) {
  bigPictureImg.setAttribute('src', picture.url);
  likesCount.textContent = picture.likes;
  commentsCount.textContent = picture.comments.length;
  socialCaption.textContent = picture.description;
};
fillBigPicture(imagesArray[0]);


// Список комментариев под фотографией: комментарии должны вставляться в блок .social__comments. Разметка каждого комментария должна выглядеть так:
// <li class="social__comment">
//   <img
//     class="social__picture"
//     src="img/avatar-{{случайное число от 1 до 6}}.svg"
//     alt="{{Автор комментария}}"
//     width="35" height="35">
//   <p class="social__text">{{текст комментария}}</p>
// </li>
