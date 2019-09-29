var COMMENTS_NUMBER = 2;
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
    })
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
}

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


var uploadFile = document.querySelector('#upload-file');
var editFormPopup = document.querySelector('.img-upload__overlay');
var closeEditFormPopup = editFormPopup.querySelector('#upload-cancel');

var sliderPin = editFormPopup.querySelector('.effect-level__pin');
var slider = editFormPopup.querySelector('.effect-level__line');
var image = editFormPopup.querySelector('.img-upload__preview img');
var effectPreviewFields = editFormPopup.querySelectorAll('input[name="effect"]');
var effectValueField = editFormPopup.querySelector('.effect-level__value');

var editForm = document.querySelector('.img-upload__form');
var tagsList = editFormPopup.querySelector('input[name="hashtags"]').value;
var tagsListInput = editFormPopup.querySelector('input[name="hashtags"]');
var submitFormButton = editFormPopup.querySelector('.img-upload__submit');
var currentFilter;

// Добавить проверки: хэш-теги разделяются пробелами;
// один и тот же хэш-тег не может быть использован дважды;

var isValid = function () {
  var tagListData = tagsList.split(' ');
  var valid = true;
  var message = '';
  // var uniqueHashtagsList = [];
  if (tagListData.length > 5) {
    message = 'Нельзя указать больше пяти хэш-тегов';
    return valid = false;
  }
  for (var i = 0; i < tagListData.length; i++) {
    var tag = tagListData[i].toLowerCase();
    if (tag.charAt(0) !== "#" ) {
      message = 'Хеш-тег должен начинаться с #'
      return valid = false;
    }
    if (tag.length === 1) {
      message = 'Хеш-тег не может состоять только из #';
      return valid = false;
    }
    if (tag.length > 20) {
      message = 'Максимальная длина хэш-тега должна быть 20 символов';
      return valid = false;
    }
    // if (!uniqueHashtagsList.includes(tag)) {
    //   uniqueHashtagsList.push(tag);
    // }
  };
  return valid;
};

var hashtagsAreValid = isValid();

var showeditFormPopup = function () {
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
  if (!hashtagsAreValid) {
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
    p = max;
  } else {
    var width = slider.offsetWidth;
    var left = sliderPin.offsetLeft;
    p = left/width;
  }
  var value='';

  switch(currentFilter) {
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
  showeditFormPopup();
};

var onCloseForm = function () {
  closeForm();
};

var onPressEscClose = function(evt) {
  if (evt.keyCode === ESC_CODE) {
    closeForm();
  }
};

var onMouseUpEffectLevel = function () {
  setEffectLevel()
};

var onEnterPressSubmitForm = function (evt) {
  submitForm();
}

var onChangeEffect = function (evt) {
  var id = evt.target.value;
  setFilter(id);
  setEffectLevel(1);
}

uploadFile.addEventListener('change', onUploadFileChange);
sliderPin.addEventListener('mouseup', onMouseUpEffectLevel);

for (var i = 0; i < effectPreviewFields.length; i++) {
  effectPreviewFields[i].addEventListener('change', onChangeEffect);
};
submitFormButton.addEventListener('click', onEnterPressSubmitForm);

// если фокус находится в поле ввода хэш-тега, нажатие на Esc не должно приводить к закрытию формы редактирования изображения.
