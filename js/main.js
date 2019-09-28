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
var editForm = document.querySelector('.img-upload__overlay');
var closeEditForm = editForm.querySelector('#upload-cancel')
var sliderPin = editForm.querySelector('.effect-level__pin');
var slider = editForm.querySelector('.effect-level__line');
var tagsList = editForm.querySelector('input[name="hashtags"]').value;

var isValid = function () {
  var tagListData = tagsList.split(' ');
  var valid = true;
  if (tagListData.length > 5) {
    return valid = false;
  }
  for (var i = 0; i < tagListData.length; i++) {
    var tag = tagListData[i];
    if (tag.charAt(0) !== "#" ) {
      return valid = false;
    }
    if (tag.length === 1) {
      return valid = false;
    }
    if (tag.length > 20) {
      return valid = false;
    }
  };
  return valid;
}

isValid();

// хэш-теги разделяются пробелами;
// один и тот же хэш-тег не может быть использован дважды;
// теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом;


var showEditForm = function () {
  editForm.classList.remove('hidden');
  closeEditForm.addEventListener('click', onCloseForm);
  document.addEventListener('keydown', onPressEscClose);
};

var closeForm = function () {
  editForm.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('change', onUploadFileChange);
  document.removeEventListener('click', onCloseForm);
  document.removeEventListener('keydown', onPressEscClose);
};

var changeEffectLevel = function () {

};

var onUploadFileChange = function () {
  showEditForm();
};

var onCloseForm = function () {
  closeForm();
};

var onPressEscClose = function(evt) {
  if (evt.keyCode === ESC_CODE) {
    closeForm();
  }
};

var onMouseUpEffectLevel = function (evt) {
  var width = slider.offsetWidth;
  var left = sliderPin.offsetLeft;
  var p = left * 100/width;

  changeEffectLevel();
};

uploadFile.addEventListener('change', onUploadFileChange);
sliderPin.addEventListener('mouseup', onMouseUpEffectLevel);


//.effect-level__pin mouseup, изменять уровень насыщенности фильтра для изображения.
//рассчитать положение пина слайдера относительно всего блока и воспользоваться пропорцией
// при переключении сбросить насыщенность
//какой ивент будет при переключении?
// если фокус находится в поле ввода хэш-тега, нажатие на Esc не должно приводить к закрытию формы редактирования изображения.
